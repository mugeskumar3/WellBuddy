import { DatabaseAdapter } from '../connection';
import { ReminderSettings, ReminderType } from '../../shared/types';

interface ReminderRow {
  id: string;
  name: string;
  enabled: number;
  interval_minutes: number;
  snooze_minutes: number;
  start_time: string;
  end_time: string;
  active_days: string;
  quiet_hours_enabled: number;
  quiet_start_time: string;
  quiet_end_time: string;
  sound_enabled: number;
  created_at: number;
  updated_at: number;
}

function mapRowToSettings(row: ReminderRow): ReminderSettings {
  return {
    id: row.id as ReminderType,
    name: row.name,
    enabled: Boolean(row.enabled),
    intervalMinutes: row.interval_minutes,
    snoozeMinutes: row.snooze_minutes,
    workingHours: {
      startTime: row.start_time,
      endTime: row.end_time,
      activeDays: JSON.parse(row.active_days || '[1,2,3,4,5]'),
    },
    quietHours: {
      enabled: Boolean(row.quiet_hours_enabled),
      startTime: row.quiet_start_time,
      endTime: row.quiet_end_time,
    },
    soundEnabled: Boolean(row.sound_enabled),
    updatedAt: row.updated_at,
  };
}

export class ReminderRepository {
  constructor(private db: DatabaseAdapter) {}

  getAll(): ReminderSettings[] {
    const rows = this.db.prepare<ReminderRow>('SELECT * FROM reminder_settings ORDER BY id ASC').all();
    return rows.map(mapRowToSettings);
  }

  getById(id: ReminderType): ReminderSettings | undefined {
    const row = this.db.prepare<ReminderRow>('SELECT * FROM reminder_settings WHERE id = ?').get(id);
    return row ? mapRowToSettings(row) : undefined;
  }

  update(settings: ReminderSettings): void {
    const now = Date.now();
    this.db.prepare(`
      UPDATE reminder_settings SET
        name = ?,
        enabled = ?,
        interval_minutes = ?,
        snooze_minutes = ?,
        start_time = ?,
        end_time = ?,
        active_days = ?,
        quiet_hours_enabled = ?,
        quiet_start_time = ?,
        quiet_end_time = ?,
        sound_enabled = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      settings.name,
      settings.enabled ? 1 : 0,
      settings.intervalMinutes,
      settings.snoozeMinutes,
      settings.workingHours.startTime,
      settings.workingHours.endTime,
      JSON.stringify(settings.workingHours.activeDays),
      settings.quietHours.enabled ? 1 : 0,
      settings.quietHours.startTime,
      settings.quietHours.endTime,
      settings.soundEnabled ? 1 : 0,
      now,
      settings.id
    );
  }
}
