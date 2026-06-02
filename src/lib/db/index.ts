import * as pgSchema from "./schema.pg";
import * as sqliteSchema from "./schema.sqlite";
import { seedIfEmpty } from "./seed";

/**
 * Database layer with two backends:
 *   - Production (Railway): PostgreSQL when DATABASE_URL is a postgres:// URL
 *   - Local dev: SQLite using Bun's built-in sqlite (no native compilation needed)
 *
 * getDb() is async and returns { db, schema, dialect }.
 * All server functions call:  const { db, schema } = await getDb();
 */

export type Dialect = "pg" | "sqlite";
export type Schema = typeof pgSchema;

export type DbConn = {
  db: any;
  schema: Schema;
  dialect: Dialect;
};

let _conn: DbConn | null = null;
let _initPromise: Promise<DbConn> | null = null;

function resolveDialect(): Dialect {
  const url = process.env.DATABASE_URL ?? "";
  return url.startsWith("postgres://") || url.startsWith("postgresql://") ? "pg" : "sqlite";
}

export function hasDb() {
  return true;
}

export function currentDialect(): Dialect {
  return resolveDialect();
}

async function init(): Promise<DbConn> {
  const dialect = resolveDialect();

  if (dialect === "pg") {
    const [{ default: postgres }, { drizzle }] = await Promise.all([
      import("postgres"),
      import("drizzle-orm/postgres-js"),
    ]);
    const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 10 });
    await ensurePgSchema(client);
    const db = drizzle(client, { schema: pgSchema });
    await seedIfEmpty({ db, schema: pgSchema as Schema, dialect });
    _conn = { db, schema: pgSchema as Schema, dialect };
    return _conn;
  }

  // Local dev: Bun's built-in SQLite (zero native compilation — always available)
  const [{ Database }, { drizzle }, fs, path] = await Promise.all([
    import("bun:sqlite"),
    import("drizzle-orm/bun-sqlite"),
    import("node:fs"),
    import("node:path"),
  ]);
  const dir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = process.env.SQLITE_PATH ?? path.join(dir, "local.db");
  const sqlite = new Database(file);
  sqlite.exec("PRAGMA journal_mode = WAL;");
  ensureSqliteSchema(sqlite);
  const db = drizzle(sqlite, { schema: sqliteSchema });
  await seedIfEmpty({ db, schema: sqliteSchema as unknown as Schema, dialect });
  _conn = { db, schema: sqliteSchema as unknown as Schema, dialect };
  return _conn;
}

export async function getDb(): Promise<DbConn> {
  if (_conn) return _conn;
  if (!_initPromise) _initPromise = init();
  return _initPromise;
}

/* ── Schema bootstrap (idempotent DDL) ──────────────────────────────── */

async function ensurePgSchema(client: any) {
  await client.unsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'member',
      phone VARCHAR(20),
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS matrimony_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      profile_id VARCHAR(20) NOT NULL UNIQUE,
      gender VARCHAR(10) NOT NULL,
      name VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL,
      height VARCHAR(20),
      religion VARCHAR(50),
      rasi VARCHAR(50),
      star VARCHAR(50),
      gotram VARCHAR(100),
      education TEXT,
      profession VARCHAR(255),
      income VARCHAR(100),
      location VARCHAR(255),
      about TEXT,
      expectations TEXT,
      photo_url VARCHAR(500),
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      ai_match_data JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(255) NOT NULL,
      area VARCHAR(255),
      profession VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255),
      membership_number VARCHAR(100),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      joined_at TIMESTAMP NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date TIMESTAMP NOT NULL,
      venue VARCHAR(255),
      image_url VARCHAR(500),
      status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS event_registrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      event_id INTEGER NOT NULL REFERENCES events(id),
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS scholarships (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      student_name VARCHAR(255) NOT NULL,
      school VARCHAR(255),
      marks NUMERIC(5,2),
      annual_income NUMERIC(12,2),
      category VARCHAR(100),
      contact_phone VARCHAR(20),
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      admin_notes TEXT,
      documents JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);
}

function ensureSqliteSchema(sqlite: any) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      phone TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS matrimony_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      profile_id TEXT NOT NULL UNIQUE,
      gender TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      height TEXT,
      religion TEXT,
      rasi TEXT,
      star TEXT,
      gotram TEXT,
      education TEXT,
      profession TEXT,
      income TEXT,
      location TEXT,
      about TEXT,
      expectations TEXT,
      photo_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      ai_match_data TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      name TEXT NOT NULL,
      area TEXT,
      profession TEXT,
      phone TEXT,
      email TEXT,
      membership_number TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      joined_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date INTEGER NOT NULL,
      venue TEXT,
      image_url TEXT,
      status TEXT NOT NULL DEFAULT 'upcoming',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      event_id INTEGER NOT NULL REFERENCES events(id),
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scholarships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      student_name TEXT NOT NULL,
      school TEXT,
      marks TEXT,
      annual_income TEXT,
      category TEXT,
      contact_phone TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      admin_notes TEXT,
      documents TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}
