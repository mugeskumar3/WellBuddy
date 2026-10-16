import { createDatabase, DatabaseAdapter } from './connection';
import { runMigrations } from './migrator';
import { ReminderRepository } from './repositories/reminder-repository';
import { OccurrenceRepository } from './repositories/occurrence-repository';
import { WaterRepository } from './repositories/water-repository';
import { ActivityLogRepository } from './repositories/activity-log-repository';
import { PreferencesRepository } from './repositories/preferences-repository';

export interface DatabaseService {
  db: DatabaseAdapter;
  reminders: ReminderRepository;
  occurrences: OccurrenceRepository;
  water: WaterRepository;
  activityLogs: ActivityLogRepository;
  preferences: PreferencesRepository;
  close: () => void;
}

export function initDatabase(dbPath: string): DatabaseService {
  const db = createDatabase(dbPath);
  runMigrations(db);

  return {
    db,
    reminders: new ReminderRepository(db),
    occurrences: new OccurrenceRepository(db),
    water: new WaterRepository(db),
    activityLogs: new ActivityLogRepository(db),
    preferences: new PreferencesRepository(db),
    close: () => db.close(),
  };
}
