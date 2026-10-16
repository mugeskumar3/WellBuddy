import path from 'path';
import fs from 'fs';

export interface RunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface StatementAdapter<T = any> {
  run(...params: any[]): RunResult;
  get(...params: any[]): T | undefined;
  all(...params: any[]): T[];
}

export interface DatabaseAdapter {
  exec(sql: string): void;
  prepare<T = any>(sql: string): StatementAdapter<T>;
  transaction<T>(fn: () => T): () => T;
  close(): void;
  pragma(sql: string): any;
}

export function createDatabase(dbPath: string): DatabaseAdapter {
  // Ensure directory exists if not memory
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Try better-sqlite3 first, fallback to node:sqlite
  try {
    const BetterSqlite = require('better-sqlite3');
    const db = new BetterSqlite(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    return {
      exec: (sql: string) => db.exec(sql),
      prepare: <T = any>(sql: string): StatementAdapter<T> => {
        const stmt = db.prepare(sql);
        return {
          run: (...params: any[]) => stmt.run(...params),
          get: (...params: any[]) => stmt.get(...params) as T | undefined,
          all: (...params: any[]) => stmt.all(...params) as T[],
        };
      },
      transaction: <T>(fn: () => T) => db.transaction(fn),
      close: () => db.close(),
      pragma: (sql: string) => db.pragma(sql),
    };
  } catch (betterSqliteErr) {
    // Fallback to built-in node:sqlite
    try {
      const { DatabaseSync } = require('node:sqlite');
      const db = new DatabaseSync(dbPath);
      db.exec('PRAGMA journal_mode = WAL;');
      db.exec('PRAGMA foreign_keys = ON;');

      return {
        exec: (sql: string) => db.exec(sql),
        prepare: <T = any>(sql: string): StatementAdapter<T> => {
          const stmt = db.prepare(sql);
          return {
            run: (...params: any[]) => {
              const res = stmt.run(...params);
              return {
                changes: Number(res.changes || 0),
                lastInsertRowid: res.lastInsertRowid ?? 0,
              };
            },
            get: (...params: any[]) => stmt.get(...params) as T | undefined,
            all: (...params: any[]) => stmt.all(...params) as T[],
          };
        },
        transaction: <T>(fn: () => T) => {
          return () => {
            db.exec('BEGIN IMMEDIATE');
            try {
              const result = fn();
              db.exec('COMMIT');
              return result;
            } catch (err) {
              db.exec('ROLLBACK');
              throw err;
            }
          };
        },
        close: () => db.close(),
        pragma: (sql: string) => {
          try {
            return db.prepare(`PRAGMA ${sql}`).all();
          } catch {
            return null;
          }
        },
      };
    } catch (nodeSqliteErr) {
      throw new Error(`Failed to initialize SQLite database with both better-sqlite3 and node:sqlite: ${betterSqliteErr}; ${nodeSqliteErr}`);
    }
  }
}
