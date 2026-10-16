import { DatabaseAdapter } from './connection';
import { migration001 } from './migrations/001_initial_schema';

export interface Migration {
  id: number;
  name: string;
  up: (db: DatabaseAdapter) => void;
}

const allMigrations: Migration[] = [
  migration001,
];

export function runMigrations(db: DatabaseAdapter): void {
  // Ensure _migrations table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at INTEGER NOT NULL
    );
  `);

  const appliedRows = db.prepare<{ name: string }>('SELECT name FROM _migrations').all();
  const appliedNames = new Set(appliedRows.map((r) => r.name));

  for (const mig of allMigrations) {
    if (!appliedNames.has(mig.name)) {
      const applyMigration = db.transaction(() => {
        mig.up(db);
        db.prepare('INSERT INTO _migrations (id, name, applied_at) VALUES (?, ?, ?)').run(
          mig.id,
          mig.name,
          Date.now()
        );
      });
      applyMigration();
    }
  }
}
