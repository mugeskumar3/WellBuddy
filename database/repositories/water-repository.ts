import { DatabaseAdapter } from '../connection';
import { WaterEntry } from '../../shared/types';

interface WaterRow {
  id: string;
  amount_ml: number;
  logged_at: number;
  created_at: number;
}

function mapRowToWater(row: WaterRow): WaterEntry {
  return {
    id: row.id,
    amountMl: row.amount_ml,
    loggedAt: row.logged_at,
    createdAt: row.created_at,
  };
}

export class WaterRepository {
  constructor(private db: DatabaseAdapter) {}

  add(entry: WaterEntry): void {
    this.db.prepare(`
      INSERT INTO water_entries (id, amount_ml, logged_at, created_at)
      VALUES (?, ?, ?, ?)
    `).run(entry.id, entry.amountMl, entry.loggedAt, entry.createdAt);
  }

  delete(id: string): boolean {
    const res = this.db.prepare('DELETE FROM water_entries WHERE id = ?').run(id);
    return res.changes > 0;
  }

  getEntriesForRange(startMs: number, endMs: number): WaterEntry[] {
    const rows = this.db.prepare<WaterRow>(`
      SELECT * FROM water_entries 
      WHERE logged_at >= ? AND logged_at <= ? 
      ORDER BY logged_at DESC
    `).all(startMs, endMs);
    return rows.map(mapRowToWater);
  }

  getTodayEntries(nowMs = Date.now()): WaterEntry[] {
    const d = new Date(nowMs);
    d.setHours(0, 0, 0, 0);
    const startOfDay = d.getTime();
    d.setHours(23, 59, 59, 999);
    const endOfDay = d.getTime();

    return this.getEntriesForRange(startOfDay, endOfDay);
  }

  getTodayTotal(nowMs = Date.now()): number {
    const entries = this.getTodayEntries(nowMs);
    return entries.reduce((sum, e) => sum + e.amountMl, 0);
  }

  getDailyTotalsForDays(daysCount = 7, nowMs = Date.now()): { date: string; waterMl: number }[] {
    const results: { date: string; waterMl: number }[] = [];
    const base = new Date(nowMs);

    for (let i = daysCount - 1; i >= 0; i--) {
      const day = new Date(base);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const startMs = day.getTime();
      day.setHours(23, 59, 59, 999);
      const endMs = day.getTime();

      const dateStr = day.toISOString().split('T')[0];
      const row = this.db.prepare<{ total: number | null }>(`
        SELECT SUM(amount_ml) as total FROM water_entries 
        WHERE logged_at >= ? AND logged_at <= ?
      `).get(startMs, endMs);

      results.push({
        date: dateStr,
        waterMl: row?.total || 0,
      });
    }

    return results;
  }
}
