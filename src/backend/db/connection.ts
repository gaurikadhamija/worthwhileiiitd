import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

// Store SQLite database file in ./data/campus_events.db
const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'campus_events.db');

export const db = new DatabaseSync(DB_PATH);

// Enable Foreign Key constraints and WAL mode for high reliability
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
`);

export function getDb(): DatabaseSync {
  return db;
}
