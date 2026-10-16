import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initDatabase, DatabaseService } from '../../database';
import { ReminderScheduler } from '../../electron/engine/scheduler';
import { ActivePromptInfo, OccurrenceStatus, ReminderType } from '../../shared/types';

describe('ReminderScheduler Engine', () => {
  let dbService: DatabaseService;
  let scheduler: ReminderScheduler;
  let deliveredPrompts: ActivePromptInfo[];
  let statusChanges: { type: ReminderType; status: OccurrenceStatus }[];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-16T10:00:00.000Z')); // Friday 10:00 AM (during working hours)

    dbService = initDatabase(':memory:');
    deliveredPrompts = [];
    statusChanges = [];

    scheduler = new ReminderScheduler(
      dbService,
      (prompt) => {
        deliveredPrompts.push(prompt);
      },
      (info) => {
        statusChanges.push(info);
      }
    );
  });

  afterEach(() => {
    scheduler.stop();
    dbService.close();
    vi.useRealTimers();
  });

  it('operates all four reminder types independently', () => {
    scheduler.start();

    const nextReminders = scheduler.getNextReminders();
    expect(nextReminders.length).toBe(4);

    const types = nextReminders.map((r) => r.type);
    expect(types).toContain('water');
    expect(types).toContain('standing');
    expect(types).toContain('eye_rest');
    expect(types).toContain('stretching');

    // Eye rest has interval 20 min -> should be earliest
    expect(nextReminders[0].type).toBe('eye_rest');
  });

  it('updating one reminder interval does not affect another reminder', () => {
    scheduler.start();

    const waterBefore = scheduler.getNextReminders().find((r) => r.type === 'water')!;
    const standingBefore = scheduler.getNextReminders().find((r) => r.type === 'standing')!;

    // Change water interval to 15 minutes
    const waterSettings = dbService.reminders.getById('water')!;
    dbService.reminders.update({
      ...waterSettings,
      intervalMinutes: 15,
    });
    scheduler.recalculate('water', true);

    const waterAfter = scheduler.getNextReminders().find((r) => r.type === 'water')!;
    const standingAfter = scheduler.getNextReminders().find((r) => r.type === 'standing')!;

    expect(standingAfter.dueAt).toBe(standingBefore.dueAt);
    expect(waterAfter.dueAt).not.toBe(waterBefore.dueAt);
  });

  it('does not deliver disabled reminders', () => {
    // Disable eye_rest
    const eyeRest = dbService.reminders.getById('eye_rest')!;
    dbService.reminders.update({
      ...eyeRest,
      enabled: false,
    });

    scheduler.start();

    const activeList = scheduler.getNextReminders();
    expect(activeList.find((r) => r.type === 'eye_rest')).toBeUndefined();

    // Fast-forward 25 minutes
    vi.advanceTimersByTime(25 * 60 * 1000);

    const deliveredTypes = deliveredPrompts.map((p) => p.type);
    expect(deliveredTypes).not.toContain('eye_rest');
  });

  it('snoozed occurrences do not generate duplicate notifications for the same occurrence', () => {
    scheduler.start();

    // Fast-forward 20 minutes to trigger eye_rest
    vi.advanceTimersByTime(20 * 60 * 1000);

    expect(deliveredPrompts.length).toBe(1);
    const triggeredPrompt = deliveredPrompts[0];
    expect(triggeredPrompt.type).toBe('eye_rest');

    // Snooze for 5 minutes
    const snoozedOk = scheduler.snoozeOccurrence(triggeredPrompt.occurrenceId, 'eye_rest', 5);
    expect(snoozedOk).toBe(true);

    const occ = dbService.occurrences.getById(triggeredPrompt.occurrenceId);
    expect(occ?.status).toBe('snoozed');

    // 2 minutes later: should NOT trigger yet
    vi.advanceTimersByTime(2 * 60 * 1000);
    expect(deliveredPrompts.length).toBe(1);

    // 3 more minutes later (total 5): snooze expires and triggers
    vi.advanceTimersByTime(3 * 60 * 1000);
    expect(deliveredPrompts.length).toBe(2);
    expect(deliveredPrompts[1].occurrenceId).toBe(triggeredPrompt.occurrenceId);
  });

  it('completed occurrences cannot be completed or logged twice', () => {
    scheduler.start();

    // Trigger eye_rest
    vi.advanceTimersByTime(20 * 60 * 1000);
    const triggered = deliveredPrompts[0];

    const completedFirst = scheduler.completeOccurrence(triggered.occurrenceId, 'eye_rest');
    expect(completedFirst).toBe(true);

    const logsFirst = dbService.activityLogs.getTodayLogs();
    expect(logsFirst.filter((l) => l.action === 'completed').length).toBe(1);

    // Attempt to complete again
    const completedSecond = scheduler.completeOccurrence(triggered.occurrenceId, 'eye_rest');
    expect(completedSecond).toBe(true); // returns true idempotent
    const logsSecond = dbService.activityLogs.getTodayLogs();
    expect(logsSecond.filter((l) => l.action === 'completed').length).toBe(1); // not logged twice!
  });

  it('skipped occurrences advance correctly', () => {
    scheduler.start();

    vi.advanceTimersByTime(20 * 60 * 1000);
    const triggered = deliveredPrompts[0];

    const skipped = scheduler.skipOccurrence(triggered.occurrenceId, 'eye_rest');
    expect(skipped).toBe(true);

    const occ = dbService.occurrences.getById(triggered.occurrenceId);
    expect(occ?.status).toBe('skipped');

    // A new occurrence for eye_rest should now be scheduled in the future
    const nextReminders = scheduler.getNextReminders();
    const nextEyeRest = nextReminders.find((r) => r.type === 'eye_rest');
    expect(nextEyeRest).toBeDefined();
    expect(nextEyeRest?.dueAt).toBeGreaterThan(Date.now());
  });

  it('handles overdue occurrences according to the recovery policy on restart', () => {
    const now = Date.now();
    // Simulate an occurrence from 2 hours ago while app was closed
    const staleOccId = `water_${now - 2 * 60 * 60 * 1000}`;
    dbService.occurrences.create({
      id: staleOccId,
      reminderId: 'water',
      scheduledAt: now - 2 * 60 * 60 * 1000,
      status: 'scheduled',
      snoozedUntil: null,
      deliveredAt: null,
      completedAt: null,
      createdAt: now - 2 * 60 * 60 * 1000,
    });

    // Scheduler starts up (e.g. app launched)
    scheduler.start();

    // The stale occurrence must have been marked 'skipped' by recovery policy
    const staleOcc = dbService.occurrences.getById(staleOccId);
    expect(staleOcc?.status).toBe('skipped');

    // No notification storm occurred!
    expect(deliveredPrompts.length).toBe(0);
  });

  it('pause and resume correctly suppress and restore notifications', () => {
    scheduler.start();

    scheduler.pause();
    expect(dbService.preferences.getAll().remindersPaused).toBe(true);

    // Advance 60 minutes
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(deliveredPrompts.length).toBe(0);

    // Resume
    scheduler.resume();
    expect(dbService.preferences.getAll().remindersPaused).toBe(false);

    // Reminders should now be rescheduled
    const next = scheduler.getNextReminders();
    expect(next.length).toBe(4);
  });
});
