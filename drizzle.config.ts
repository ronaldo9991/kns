import { defineConfig } from "drizzle-kit";

// Production / Postgres (Railway). Used by `bun run db:push`, `db:studio`, etc.
// Requires DATABASE_URL to be a postgres:// connection string.
export default defineConfig({
  schema: "./src/lib/db/schema.pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
