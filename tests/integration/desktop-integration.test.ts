import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initDatabase, DatabaseService } from '../../database';
import { ReminderScheduler } from '../../electron/engine/scheduler';
import { StartupManager } from '../../electron/startup/startup-manager';
import { ActivePromptInfo } from '../../shared/types';

describe('Desktop & Windows Integration Behaviors', () => {
  let dbService: DatabaseService;
  let scheduler: ReminderScheduler;
  let deliveredPrompts: ActivePromptInfo[];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-16T10:00:00.000Z')); // Friday morning

    dbService = initDatabase(':memory:');
    deliveredPrompts = [];
    scheduler = new ReminderScheduler(dbService, (prompt) => {
      deliveredPrompts.push(prompt);
    });
  });

  afterEach(() => {
    scheduler.stop();
    dbService.close();
    vi.useRealTimers();
  });

  it('hiding the floating companion does not stop or suspend background reminders', () => {
    scheduler.start();

    // User hides companion in preferences
    dbService.preferences.update({ companionVisible: false });
    expect(dbService.preferences.getAll().companionVisible).toBe(false);

    // Advance time by 20 minutes (eye_rest interval)
    vi.advanceTimersByTime(20 * 60 * 1000);

    // Reminders must still be scheduled and delivered!
    expect(deliveredPrompts.length).toBe(1);
    expect(deliveredPrompts[0].type).toBe('eye_rest');
  });

  it('persists companion position updates smoothly when dragged', () => {
    const initialPos = dbService.preferences.getAll().companionPosition;
    expect(initialPos).toEqual({ x: 100, y: 100 });

    // Drag to new coordinate (e.g. user dragged mascot to top right)
    const newPos = { x: 850, y: 40 };
    dbService.preferences.update({ companionPosition: newPos });

    const refetched = dbService.preferences.getAll().companionPosition;
    expect(refetched).toEqual({ x: 850, y: 40 });
  });

  it('manages Windows startup configuration preference reliably', () => {
    const startupManager = new StartupManager(dbService);

    // Default startup state on initial setup must be enabled
    expect(startupManager.isStartAtLogin()).toBe(true);

    // User disables startup in settings
    const disabledOk = startupManager.setStartAtLogin(false);
    expect(disabledOk).toBe(true);
    expect(startupManager.isStartAtLogin()).toBe(false);

    // Re-enable startup
    const enabledOk = startupManager.setStartAtLogin(true);
    expect(enabledOk).toBe(true);
    expect(startupManager.isStartAtLogin()).toBe(true);
  });

  it('paces notifications to prevent notification storms when reminders become due at the same time', () => {
    // Disable eye_rest and stretching to isolate water and standing
    const eyeRest = dbService.reminders.getById('eye_rest')!;
    const stretching = dbService.reminders.getById('stretching')!;
    dbService.reminders.update({ ...eyeRest, enabled: false });
    dbService.reminders.update({ ...stretching, enabled: false });

    // Set both water and standing to 30 minutes
    const water = dbService.reminders.getById('water')!;
    const standing = dbService.reminders.getById('standing')!;
    dbService.reminders.update({ ...water, intervalMinutes: 30 });
    dbService.reminders.update({ ...standing, intervalMinutes: 30 });

    scheduler.start();

    // Advance 30 minutes: both water and standing become due simultaneously
    vi.advanceTimersByTime(30 * 60 * 1000);

    // First reminder delivers immediately
    expect(deliveredPrompts.length).toBe(1);

    // Anti-storm spacing of 2500ms prevents second notification from firing at same millisecond
    vi.advanceTimersByTime(1000);
    expect(deliveredPrompts.length).toBe(1);

    // After 2.5s pacing delay, the second notification is safely delivered
    vi.advanceTimersByTime(2000);
    expect(deliveredPrompts.length).toBe(2);
  });
});
