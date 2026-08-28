import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

export const DATABASE_NAME = 'medical_app.db';

/**
 * WAL mode needs a companion `-wal`/`-shm` file living alongside the main
 * database file. On native that's a normal filesystem, no problem. On web,
 * expo-sqlite runs on wa-sqlite's OPFS AccessHandlePoolVFS, which as of
 * this writing has no working WAL support - setting WAL there either fails
 * outright or (worse) gets recorded in the database file's own header, so
 * every future reopen of that file tries to resume WAL and fails at
 * sqlite3_open_v2 with "cannot create file", even after clearing the
 * service worker/cache. `MEMORY` avoids touching the OPFS file at all for
 * the journal and is the workaround the wa-sqlite project itself recommends
 * for this exact VFS.
 */
const JOURNAL_MODE = Platform.OS === 'web' ? 'MEMORY' : 'WAL';

/**
 * Bumped whenever the statements below change, so `migrateDatabase`
 * knows whether this device's DB still needs to run them.
 */
const SCHEMA_VERSION = 2;

const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    template_type TEXT,
    tags TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

const CREATE_FLASHCARDS_TABLE = `
  CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    deck_name TEXT NOT NULL DEFAULT 'General',
    interval INTEGER NOT NULL DEFAULT 0,
    ease_factor REAL NOT NULL DEFAULT 2.5,
    repetitions INTEGER NOT NULL DEFAULT 0,
    next_review TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

const CREATE_CALCULATORS_TABLE = `
  CREATE TABLE IF NOT EXISTS calculators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    formula_data TEXT NOT NULL DEFAULT '{}'
  );
`;

const CREATE_VADEMECUM_TABLE = `
  CREATE TABLE IF NOT EXISTS vademecum (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_generico TEXT NOT NULL,
    categoria TEXT NOT NULL,
    dosis_adultos TEXT NOT NULL,
    dosis_pediatrica TEXT NOT NULL,
    contraindicaciones TEXT NOT NULL,
    mecanismo_accion TEXT NOT NULL
  );
`;

const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_notes_template_type ON notes (template_type);
  CREATE INDEX IF NOT EXISTS idx_flashcards_deck_name ON flashcards (deck_name);
  CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards (next_review);
  CREATE INDEX IF NOT EXISTS idx_calculators_category ON calculators (category);
  CREATE INDEX IF NOT EXISTS idx_vademecum_nombre_generico ON vademecum (nombre_generico);
  CREATE INDEX IF NOT EXISTS idx_vademecum_categoria ON vademecum (categoria);
`;

/**
 * Called once by <SQLiteProvider onInit={migrateDatabase}> the first time
 * 'medical_app.db' is opened on a device. Safe to re-run: every statement
 * is idempotent (CREATE TABLE/INDEX IF NOT EXISTS).
 */
export async function migrateDatabase(db: SQLiteDatabase) {
  const { user_version: currentVersion } = (await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  )) ?? { user_version: 0 };

  if (currentVersion >= SCHEMA_VERSION) {
    return;
  }

  await db.execAsync(`
    PRAGMA journal_mode = ${JOURNAL_MODE};
    ${CREATE_NOTES_TABLE}
    ${CREATE_FLASHCARDS_TABLE}
    ${CREATE_CALCULATORS_TABLE}
    ${CREATE_VADEMECUM_TABLE}
    ${CREATE_INDEXES}
    PRAGMA user_version = ${SCHEMA_VERSION};
  `);
}
