import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { initDatabase, DatabaseService } from '../../database';
import { ReminderScheduler } from '../../electron/engine/scheduler';

describe('Persistence Across Application Restarts', () => {
  let tempDir: string;
  let dbFilePath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wellbuddy-restart-test-'));
    dbFilePath = path.join(tempDir, 'wellbuddy_test.db');
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('preserves reminder configuration, water logs, and preferences across database close & reopen', () => {
    // Session 1: App is running, user configures settings and logs water
    let db1: DatabaseService | null = initDatabase(dbFilePath);

    const waterSetting = db1.reminders.getById('water')!;
    db1.reminders.update({
      ...waterSetting,
      intervalMinutes: 35,
      snoozeMinutes: 8,
      soundEnabled: false,
    });

    const standingSetting = db1.reminders.getById('standing')!;
    db1.reminders.update({
      ...standingSetting,
      enabled: false,
    });

    // Update preferences
    db1.preferences.update({
      theme: 'dark',
      selectedAvatarId: 'zen-pebble',
      waterDailyGoalMl: 2800,
      companionPosition: { x: 450, y: 600 },
      startAtLogin: true,
    });

    // Log water entries
    const now = Date.now();
    db1.water.add({
      id: 'water_entry_1',
      amountMl: 350,
      loggedAt: now - 10000,
      createdAt: now - 10000,
    });
    db1.water.add({
      id: 'water_entry_2',
      amountMl: 500,
      loggedAt: now - 5000,
      createdAt: now - 5000,
    });

    // Log activity
    db1.activityLogs.add({
      id: 'act_1',
      reminderType: 'eye_rest',
      occurrenceId: 'occ_test_1',
      action: 'completed',
      occurredAt: now,
    });

    // Close Database (App Quit)
    db1.close();
    db1 = null;

    // Session 2: App starts up again (Re-open database file from disk)
    const db2 = initDatabase(dbFilePath);

    // Verify reminder settings survived restart
    const waterRestored = db2.reminders.getById('water')!;
    expect(waterRestored.intervalMinutes).toBe(35);
    expect(waterRestored.snoozeMinutes).toBe(8);
    expect(waterRestored.soundEnabled).toBe(false);

    const standingRestored = db2.reminders.getById('standing')!;
    expect(standingRestored.enabled).toBe(false);

    // Verify preferences survived restart
    const prefsRestored = db2.preferences.getAll();
    expect(prefsRestored.theme).toBe('dark');
    expect(prefsRestored.selectedAvatarId).toBe('zen-pebble');
    expect(prefsRestored.waterDailyGoalMl).toBe(2800);
    expect(prefsRestored.companionPosition).toEqual({ x: 450, y: 600 });
    expect(prefsRestored.startAtLogin).toBe(true);

    // Verify water intake survived restart
    const waterEntriesRestored = db2.water.getTodayEntries(now);
    expect(waterEntriesRestored.length).toBe(2);
    expect(db2.water.getTodayTotal(now)).toBe(850);

    // Verify activity logs survived restart
    const logsRestored = db2.activityLogs.getTodayLogs(now);
    expect(logsRestored.length).toBe(1);
    expect(logsRestored[0].reminderType).toBe('eye_rest');
    expect(logsRestored[0].action).toBe('completed');

    db2.close();
  });

  it('restores valid reminder scheduler state on startup without creating duplicate occurrences', () => {
    // Session 1: Create schedule
    let db1: DatabaseService | null = initDatabase(dbFilePath);
    let delivered1: any[] = [];
    let scheduler1: ReminderScheduler | null = new ReminderScheduler(db1, (p) => delivered1.push(p));
    scheduler1.start();

    const reminders1 = scheduler1.getNextReminders();
    expect(reminders1.length).toBe(4);
    const initialEyeRest = reminders1.find((r) => r.type === 'eye_rest')!;

    // Stop and quit session 1
    scheduler1.stop();
    scheduler1 = null;
    db1.close();
    db1 = null;

    // Session 2: Relaunch
    const db2 = initDatabase(dbFilePath);
    let delivered2: any[] = [];
    const scheduler2 = new ReminderScheduler(db2, (p) => delivered2.push(p));
    scheduler2.start();

    const reminders2 = scheduler2.getNextReminders();
    expect(reminders2.length).toBe(4);
    const restoredEyeRest = reminders2.find((r) => r.type === 'eye_rest')!;

    // The occurrence ID should be the exact same scheduled occurrence
    expect(restoredEyeRest.occurrenceId).toBe(initialEyeRest.occurrenceId);
    expect(restoredEyeRest.dueAt).toBe(initialEyeRest.dueAt);

    scheduler2.stop();
    db2.close();
  });
});
