import { DatabaseAdapter } from '../connection';
import { ActivityLog, ReminderType } from '../../shared/types';

interface ActivityLogRow {
  id: string;
  reminder_type: string;
  occurrence_id: string;
  action: string;
  occurred_at: number;
}

function mapRowToLog(row: ActivityLogRow): ActivityLog {
  return {
    id: row.id,
    reminderType: row.reminder_type as ReminderType,
    occurrenceId: row.occurrence_id,
    action: row.action as 'completed' | 'snoozed' | 'skipped',
    occurredAt: row.occurred_at,
  };
}

export class ActivityLogRepository {
  constructor(private db: DatabaseAdapter) {}

  add(log: ActivityLog): void {
    this.db.prepare(`
      INSERT INTO activity_logs (id, reminder_type, occurrence_id, action, occurred_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(log.id, log.reminderType, log.occurrenceId, log.action, log.occurredAt);
  }

  getForRange(startMs: number, endMs: number): ActivityLog[] {
    const rows = this.db.prepare<ActivityLogRow>(`
      SELECT * FROM activity_logs
      WHERE occurred_at >= ? AND occurred_at <= ?
      ORDER BY occurred_at DESC
    `).all(startMs, endMs);
    return rows.map(mapRowToLog);
  }

  getTodayLogs(nowMs = Date.now()): ActivityLog[] {
    const d = new Date(nowMs);
    d.setHours(0, 0, 0, 0);
    const startOfDay = d.getTime();
    d.setHours(23, 59, 59, 999);
    const endOfDay = d.getTime();

    return this.getForRange(startOfDay, endOfDay);
  }

  getTodaySummary(nowMs = Date.now()) {
    const logs = this.getTodayLogs(nowMs);
    const summary = {
      completed: 0,
      snoozed: 0,
      skipped: 0,
      byType: {
        water: { completed: 0, snoozed: 0, skipped: 0 },
        standing: { completed: 0, snoozed: 0, skipped: 0 },
        eye_rest: { completed: 0, snoozed: 0, skipped: 0 },
        stretching: { completed: 0, snoozed: 0, skipped: 0 },
      } as Record<ReminderType, { completed: number; snoozed: number; skipped: number }>,
      logs,
    };

    for (const log of logs) {
      if (log.action === 'completed') summary.completed++;
      if (log.action === 'snoozed') summary.snoozed++;
      if (log.action === 'skipped') summary.skipped++;

      if (summary.byType[log.reminderType]) {
        summary.byType[log.reminderType][log.action]++;
      }
    }

    return summary;
  }
}
