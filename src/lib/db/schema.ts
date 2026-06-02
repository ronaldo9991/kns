// Canonical schema export used by drizzle-kit and for shared TypeScript types.
// The Postgres schema is the source of truth; schema.sqlite.ts mirrors it for
// local development. At runtime, src/lib/db/index.ts picks the matching schema
// for the active dialect.
export * from "./schema.pg";
