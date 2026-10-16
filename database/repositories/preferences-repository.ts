import { DatabaseAdapter } from '../connection';
import { UserPreferences } from '../../shared/types';

interface PrefRow {
  key: string;
  value: string;
  updated_at: number;
}

export class PreferencesRepository {
  constructor(private db: DatabaseAdapter) {}

  getAll(): UserPreferences {
    const rows = this.db.prepare<PrefRow>('SELECT * FROM user_preferences').all();
    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    let companionPosition = { x: 100, y: 100 };
    try {
      if (map.has('companionPosition')) {
        companionPosition = JSON.parse(map.get('companionPosition')!);
      }
    } catch {
      // fallback
    }

    return {
      theme: (map.get('theme') as any) || 'light',
      soundEnabled: map.get('soundEnabled') !== 'false',
      notificationsEnabled: map.get('notificationsEnabled') !== 'false',
      startAtLogin: map.get('startAtLogin') !== 'false',
      startMinimized: map.get('startMinimized') === 'true',
      companionVisible: map.get('companionVisible') !== 'false',
      companionPosition,
      companionSize: (map.get('companionSize') as any) || 'standard',
      selectedAvatarId: map.get('selectedAvatarId') || 'water-drop',
      customAvatarPath: map.get('customAvatarPath') || null,
      waterDailyGoalMl: parseInt(map.get('waterDailyGoalMl') || '2000', 10),
      remindersPaused: map.get('remindersPaused') === 'true',
      pauseUntil: map.get('pauseUntil') ? parseInt(map.get('pauseUntil')!, 10) : null,
    };
  }

  get(key: keyof UserPreferences): string | undefined {
    const row = this.db.prepare<PrefRow>('SELECT value FROM user_preferences WHERE key = ?').get(key as string);
    return row?.value;
  }

  update(updates: Partial<UserPreferences>): UserPreferences {
    const now = Date.now();
    const updateStmt = this.db.prepare(`
      INSERT INTO user_preferences (key, value, updated_at) 
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);

    const applyUpdates = this.db.transaction(() => {
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) continue;
        let strVal: string;
        if (typeof value === 'object' && value !== null) {
          strVal = JSON.stringify(value);
        } else if (value === null) {
          strVal = '';
        } else {
          strVal = String(value);
        }
        updateStmt.run(key, strVal, now);
      }
    });

    applyUpdates();
    return this.getAll();
  }
}
