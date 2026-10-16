import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDatabase, DatabaseService } from '../../database';
import { ReminderType } from '../../shared/types';

describe('Database & Repositories', () => {
  let dbService: DatabaseService;

  beforeEach(() => {
    // In-memory database for fast, isolated tests
    dbService = initDatabase(':memory:');
  });

  afterEach(() => {
    dbService.close();
  });

  it('runs initial migrations and seeds default reminder settings', () => {
    const reminders = dbService.reminders.getAll();
    expect(reminders.length).toBe(4);
    const ids = reminders.map((r) => r.id);
    expect(ids).toContain('water');
    expect(ids).toContain('standing');
    expect(ids).toContain('eye_rest');
    expect(ids).toContain('stretching');

    const water = dbService.reminders.getById('water');
    expect(water).toBeDefined();
    expect(water?.enabled).toBe(true);
    expect(water?.intervalMinutes).toBe(45);
    expect(water?.snoozeMinutes).toBe(5);
  });

  it('updates reminder settings independently without affecting others', () => {
    const waterBefore = dbService.reminders.getById('water')!;
    const standingBefore = dbService.reminders.getById('standing')!;

    dbService.reminders.update({
      ...waterBefore,
      intervalMinutes: 30,
      enabled: false,
    });

    const waterAfter = dbService.reminders.getById('water')!;
    const standingAfter = dbService.reminders.getById('standing')!;

    expect(waterAfter.intervalMinutes).toBe(30);
    expect(waterAfter.enabled).toBe(false);
    expect(standingAfter.intervalMinutes).toBe(standingBefore.intervalMinutes);
    expect(standingAfter.enabled).toBe(standingBefore.enabled);
  });

  it('enforces occurrence uniqueness and idempotency', () => {
    const occId = 'water_1700000000000';
    const now = Date.now();

    const created1 = dbService.occurrences.create({
      id: occId,
      reminderId: 'water',
      scheduledAt: 1700000000000,
      status: 'scheduled',
      snoozedUntil: null,
      deliveredAt: null,
      completedAt: null,
      createdAt: now,
    });
    expect(created1).toBe(true);

    // Duplicate create with same ID must be ignored (returns false / no duplicate)
    const created2 = dbService.occurrences.create({
      id: occId,
      reminderId: 'water',
      scheduledAt: 1700000000000,
      status: 'scheduled',
      snoozedUntil: null,
      deliveredAt: null,
      completedAt: null,
      createdAt: now,
    });
    expect(created2).toBe(false);

    // Complete the occurrence
    const completedOk = dbService.occurrences.updateStatus(occId, 'completed', {
      completedAt: now,
    });
    expect(completedOk).toBe(true);

    const fetched = dbService.occurrences.getById(occId);
    expect(fetched?.status).toBe('completed');
    expect(fetched?.completedAt).toBe(now);

    // Attempting to snooze an already completed occurrence should fail
    const snoozeAfterComplete = dbService.occurrences.updateStatus(occId, 'snoozed', {
      snoozedUntil: now + 300000,
    });
    expect(snoozeAfterComplete).toBe(false);
    expect(dbService.occurrences.getById(occId)?.status).toBe('completed');
  });

  it('tracks water intake and calculates daily totals', () => {
    const now = Date.now();
    dbService.water.add({
      id: 'w1',
      amountMl: 250,
      loggedAt: now,
      createdAt: now,
    });
    dbService.water.add({
      id: 'w2',
      amountMl: 500,
      loggedAt: now + 1000,
      createdAt: now + 1000,
    });

    const entries = dbService.water.getTodayEntries(now);
    expect(entries.length).toBe(2);
    expect(dbService.water.getTodayTotal(now)).toBe(750);

    // Delete one entry
    const deleted = dbService.water.delete('w1');
    expect(deleted).toBe(true);
    expect(dbService.water.getTodayTotal(now)).toBe(500);
  });

  it('persists and updates user preferences', () => {
    const prefs = dbService.preferences.getAll();
    expect(prefs.theme).toBe('light');
    expect(prefs.waterDailyGoalMl).toBe(2000);
    expect(prefs.startAtLogin).toBe(true);

    const updated = dbService.preferences.update({
      theme: 'dark',
      waterDailyGoalMl: 2500,
      companionPosition: { x: 300, y: 400 },
    });

    expect(updated.theme).toBe('dark');
    expect(updated.waterDailyGoalMl).toBe(2500);
    expect(updated.companionPosition).toEqual({ x: 300, y: 400 });

    // Verify persistence by reading again
    const refetched = dbService.preferences.getAll();
    expect(refetched.theme).toBe('dark');
    expect(refetched.waterDailyGoalMl).toBe(2500);
  });
});
