import { DatabaseAdapter } from '../connection';
import { OccurrenceStatus, ReminderOccurrence, ReminderType } from '../../shared/types';

interface OccurrenceRow {
  id: string;
  reminder_id: string;
  scheduled_at: number;
  status: string;
  snoozed_until: number | null;
  delivered_at: number | null;
  completed_at: number | null;
  created_at: number;
}

function mapRowToOccurrence(row: OccurrenceRow): ReminderOccurrence {
  return {
    id: row.id,
    reminderId: row.reminder_id as ReminderType,
    scheduledAt: row.scheduled_at,
    status: row.status as OccurrenceStatus,
    snoozedUntil: row.snoozed_until,
    deliveredAt: row.delivered_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}

export class OccurrenceRepository {
  constructor(private db: DatabaseAdapter) {}

  create(occurrence: ReminderOccurrence): boolean {
    const res = this.db.prepare(`
      INSERT OR IGNORE INTO reminder_occurrences (
        id, reminder_id, scheduled_at, status, snoozed_until, delivered_at, completed_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      occurrence.id,
      occurrence.reminderId,
      occurrence.scheduledAt,
      occurrence.status,
      occurrence.snoozedUntil,
      occurrence.deliveredAt,
      occurrence.completedAt,
      occurrence.createdAt
    );
    return res.changes > 0;
  }

  getById(id: string): ReminderOccurrence | undefined {
    const row = this.db.prepare<OccurrenceRow>('SELECT * FROM reminder_occurrences WHERE id = ?').get(id);
    return row ? mapRowToOccurrence(row) : undefined;
  }

  getLatestForReminder(reminderId: ReminderType): ReminderOccurrence | undefined {
    const row = this.db.prepare<OccurrenceRow>(`
      SELECT * FROM reminder_occurrences 
      WHERE reminder_id = ? 
      ORDER BY scheduled_at DESC 
      LIMIT 1
    `).get(reminderId);
    return row ? mapRowToOccurrence(row) : undefined;
  }

  getPendingOrSnoozed(reminderId: ReminderType): ReminderOccurrence | undefined {
    const row = this.db.prepare<OccurrenceRow>(`
      SELECT * FROM reminder_occurrences 
      WHERE reminder_id = ? AND status IN ('scheduled', 'snoozed', 'delivered')
      ORDER BY scheduled_at DESC
      LIMIT 1
    `).get(reminderId);
    return row ? mapRowToOccurrence(row) : undefined;
  }

  getAllPending(): ReminderOccurrence[] {
    const rows = this.db.prepare<OccurrenceRow>(`
      SELECT * FROM reminder_occurrences 
      WHERE status IN ('scheduled', 'snoozed')
      ORDER BY scheduled_at ASC
    `).all();
    return rows.map(mapRowToOccurrence);
  }

  updateStatus(
    id: string,
    status: OccurrenceStatus,
    extra?: { snoozedUntil?: number | null; deliveredAt?: number | null; completedAt?: number | null }
  ): boolean {
    const existing = this.getById(id);
    if (!existing) return false;

    // Prevent re-completing an already completed occurrence
    if (existing.status === 'completed' && status !== 'completed') {
      return false;
    }

    const snoozedUntil = extra && 'snoozedUntil' in extra ? extra.snoozedUntil : existing.snoozedUntil;
    const deliveredAt = extra && 'deliveredAt' in extra ? extra.deliveredAt : existing.deliveredAt;
    const completedAt = extra && 'completedAt' in extra ? extra.completedAt : existing.completedAt;

    const res = this.db.prepare(`
      UPDATE reminder_occurrences 
      SET status = ?, snoozed_until = ?, delivered_at = ?, completed_at = ?
      WHERE id = ?
    `).run(status, snoozedUntil, deliveredAt, completedAt, id);

    return res.changes > 0;
  }

  cancelPendingScheduled(reminderId: ReminderType): void {
    this.db.prepare(`
      DELETE FROM reminder_occurrences 
      WHERE reminder_id = ? AND status = 'scheduled' AND scheduled_at > ?
    `).run(reminderId, Date.now());
  }

  bulkSkipOverdue(beforeTimestamp: number): number {
    const res = this.db.prepare(`
      UPDATE reminder_occurrences
      SET status = 'skipped'
      WHERE status = 'scheduled' AND scheduled_at < ?
    `).run(beforeTimestamp);
    return res.changes;
  }
}
