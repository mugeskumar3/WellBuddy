import { DatabaseAdapter } from '../connection';

export const migration001 = {
  id: 1,
  name: '001_initial_schema',
  up: (db: DatabaseAdapter) => {
    // Migration tracking table
    db.exec(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        applied_at INTEGER NOT NULL
      );
    `);

    // Reminder settings
    db.exec(`
      CREATE TABLE IF NOT EXISTS reminder_settings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        interval_minutes INTEGER NOT NULL,
        snooze_minutes INTEGER NOT NULL DEFAULT 5,
        start_time TEXT NOT NULL DEFAULT '09:00',
        end_time TEXT NOT NULL DEFAULT '18:00',
        active_days TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
        quiet_hours_enabled INTEGER NOT NULL DEFAULT 0,
        quiet_start_time TEXT NOT NULL DEFAULT '12:00',
        quiet_end_time TEXT NOT NULL DEFAULT '13:00',
        sound_enabled INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Reminder occurrences (with unique constraint for idempotency)
    db.exec(`
      CREATE TABLE IF NOT EXISTS reminder_occurrences (
        id TEXT PRIMARY KEY,
        reminder_id TEXT NOT NULL,
        scheduled_at INTEGER NOT NULL,
        status TEXT NOT NULL,
        snoozed_until INTEGER,
        delivered_at INTEGER,
        completed_at INTEGER,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (reminder_id) REFERENCES reminder_settings(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_occurrences_due 
      ON reminder_occurrences(reminder_id, scheduled_at, status);
    `);

    // Water entries
    db.exec(`
      CREATE TABLE IF NOT EXISTS water_entries (
        id TEXT PRIMARY KEY,
        amount_ml INTEGER NOT NULL,
        logged_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_water_logged_at 
      ON water_entries(logged_at);
    `);

    // Activity logs
    db.exec(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        reminder_type TEXT NOT NULL,
        occurrence_id TEXT NOT NULL,
        action TEXT NOT NULL,
        occurred_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_activity_logs_date 
      ON activity_logs(occurred_at);
    `);

    // User preferences (key-value store for extensible app settings)
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Seed initial reminder settings if empty
    const now = Date.now();
    const countRow = db.prepare('SELECT COUNT(*) as count FROM reminder_settings').get() as { count: number };
    if (countRow.count === 0) {
      const insertReminder = db.prepare(`
        INSERT INTO reminder_settings (
          id, name, enabled, interval_minutes, snooze_minutes, 
          start_time, end_time, active_days, 
          quiet_hours_enabled, quiet_start_time, quiet_end_time,
          sound_enabled, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const defaults = [
        {
          id: 'water',
          name: 'Hydration Break',
          enabled: 1,
          interval_minutes: 45,
          snooze_minutes: 5,
        },
        {
          id: 'standing',
          name: 'Stand & Move',
          enabled: 1,
          interval_minutes: 60,
          snooze_minutes: 10,
        },
        {
          id: 'eye_rest',
          name: '20-20-20 Eye Rest',
          enabled: 1,
          interval_minutes: 20,
          snooze_minutes: 5,
        },
        {
          id: 'stretching',
          name: 'Desk Stretch',
          enabled: 1,
          interval_minutes: 90,
          snooze_minutes: 15,
        },
      ];

      for (const item of defaults) {
        insertReminder.run(
          item.id,
          item.name,
          item.enabled,
          item.interval_minutes,
          item.snooze_minutes,
          '09:00',
          '18:00',
          JSON.stringify([1, 2, 3, 4, 5]),
          0,
          '12:00',
          '13:00',
          1,
          now,
          now
        );
      }
    }

    // Seed default preferences if empty
    const prefCount = db.prepare('SELECT COUNT(*) as count FROM user_preferences').get() as { count: number };
    if (prefCount.count === 0) {
      const insertPref = db.prepare(`
        INSERT INTO user_preferences (key, value, updated_at) VALUES (?, ?, ?)
      `);

      const defaultPrefs: Record<string, string> = {
        theme: 'light',
        soundEnabled: 'true',
        notificationsEnabled: 'true',
        startAtLogin: 'true',
        startMinimized: 'false',
        companionVisible: 'true',
        companionPosition: JSON.stringify({ x: 100, y: 100 }),
        companionSize: 'standard',
        selectedAvatarId: 'water-drop',
        customAvatarPath: '',
        waterDailyGoalMl: '2000',
        remindersPaused: 'false',
        pauseUntil: '',
      };

      for (const [k, v] of Object.entries(defaultPrefs)) {
        insertPref.run(k, v, now);
      }
    }
  },
};
