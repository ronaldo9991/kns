# Kovai Nadar Sangam — Community Portal

Full-stack portal for the Kovai Nadar Sangam (Est. 1952, Coimbatore): matrimony
with AI compatibility matching, member directory, events, scholarships, an admin
panel, and English/Tamil throughout.

**Stack:** React 19 · TanStack Start (SSR) · Drizzle ORM · Tailwind v4 · Bun

## Local development

```bash
bun install
bun run dev          # http://localhost:8080
```

No database setup needed locally — the app uses a **SQLite** file at
`./data/local.db`, which is created and seeded with demo data automatically on
first request.

**Demo accounts** (seeded):

| Role   | Email          | Password   |
|--------|----------------|------------|
| Admin  | admin@kns.org  | `admin123` |
| Member | demo@kns.org   | `demo123`  |

## Environment variables

Copy `.env.example` to `.env`. All are optional for local dev:

| Variable         | Purpose                                                        |
|------------------|---------------------------------------------------------------|
| `DATABASE_URL`   | Postgres URL → enables Postgres. Unset → local SQLite.        |
| `JWT_SECRET`     | Signs auth tokens. **Required in production.**                |
| `OPENAI_API_KEY` | Enables AI matrimony analysis. Without it, rule-based scoring.|
| `OPENAI_MODEL`   | Optional. Defaults to `gpt-4o-mini`.                          |

## Deploying to Railway

1. **Create the project** and add a **PostgreSQL** plugin.
2. In your app service's **Variables**, set:
   - `DATABASE_URL` → `${{ Postgres.DATABASE_URL }}`
   - `JWT_SECRET` → a long random string
   - `OPENAI_API_KEY` → your OpenAI key (optional)
3. Deploy. [`railway.json`](railway.json) handles build & start:
   - Build: `bun install && bun run build`
   - Start: `node dist/server/index.mjs`
4. On first boot the app creates its tables (`CREATE TABLE IF NOT EXISTS`) and
   seeds demo content automatically — no manual migration step required.

The database layer (`src/lib/db/`) auto-selects the backend: a `postgres://`
`DATABASE_URL` uses Postgres, anything else uses local SQLite. The same Drizzle
query code runs against both.

### Drizzle tooling (optional)

```bash
bun run db:push     # sync schema to Postgres (needs DATABASE_URL)
bun run db:studio   # open Drizzle Studio
```

## Project layout

```
src/
  routes/            # File-based routes (incl. /admin, /login, /register)
  components/        # UI + layout (Navbar, Footer, Logo, …)
  lib/
    db/              # schema.pg.ts, schema.sqlite.ts, index.ts (driver), seed.ts
    api/             # *.functions.ts — TanStack server functions
    auth.server.ts   # JWT + bcrypt (server-only)
    auth-context.tsx # client auth state
    i18n.tsx         # English / Tamil
    matrimony-match.ts # pure compatibility scoring
```
