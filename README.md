# Cuptrail

Discover coffee shops by neighborhood, amenities, and rating, and keep a personal
journal of the places you love. Responsive web app today; a community layer and an
Expo mobile client are planned.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Prisma 7 + Neon Postgres
(serverless driver adapter) · Clerk (Google OAuth) · Tailwind CSS 4 · shadcn/ui on
Base UI · TypeScript · zod

## Getting started

Requires Node 20+ and a Neon (or any Postgres) database.

1. Create `.env` in the project root (it's gitignored — never commit it):

   ```sh
   DATABASE_URL="postgresql://…"          # Neon connection string (pooled)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_…"
   CLERK_SECRET_KEY="sk_…"
   ```

   Keep these in **one** file: `.env.local` / `.env.development` override `.env`.

2. Install, sync the schema, and seed the sample shops:

   ```sh
   npm install          # also runs `prisma generate`
   npm run db:push
   npm run db:seed
   ```

3. Start the dev server at [localhost:4000](http://localhost:4000):

   ```sh
   npm run dev
   ```

   Restart it after changing `.env*` or `src/proxy.ts`; neither hot-reloads.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 4000 |
| `npm run build` / `npm run start` | Production build / server (port 4000) |
| `npm run lint` | ESLint |
| `npm run test:ui` | jsdom interaction tests for the real components (Next, Clerk, and the API are stubbed; no DB) |
| `npm run db:push` | Apply `prisma/schema.prisma` to the database (no migration files yet) |
| `npm run db:seed` | Upsert the sample shops (idempotent) |
| `npm run db:studio` | Browse data in Prisma Studio |

## Project structure

```
prisma/
  schema.prisma        # data model only (connection string lives in prisma7.config.ts)
  seed.ts              # sample New York shops
src/
  app/                 # routes only — thin; they call server/ and render components/
    shops/             # /shops (Discover) and /shops/[slug] (detail)
    me/                # /me — "My shops" journal
    log-visit/         # /log-visit?shop=[slug]
    api/shops/         # GET endpoints for client-side paging and journal lookups
  components/
    ui/                # shadcn/Base UI primitives + Icon
    shops/             # feature components (Discover, ShopCard, ShopDetail, VisitForm, …)
    layout/            # app header/footer
    providers/         # client state (device-local journal)
  server/              # server-only data access, grouped by domain
    shops/             # queries, URL filter parsing, row → view mapping
    visits/            # queries + "use server" actions
    ratings/           # queries + "use server" actions
  lib/                 # prisma singleton, auth (getUser), and small shared helpers
  hooks/               # client hooks
  types/               # shared UI-facing types
  proxy.ts             # Clerk middleware — must sit beside app/
```

**Rules of the road**

- Pages and components never import Prisma. Reads go through `src/server/*/queries.ts`;
  writes through `src/server/*/actions.ts`, which validate input with zod, check auth,
  and return an `ActionResult` instead of throwing for expected failures.
- Import the database client only from `@/lib/prisma` (one pooled client per process)
  and the signed-in user only from `getUser()` in `@/lib/auth`.
- Clerk owns identity; Postgres owns app data. `getUser()` mirrors the Clerk user into
  the `User` table on first sight, keyed by Clerk's user ID.

## Routes

| Route | Experience |
| --- | --- |
| `/shops` | Search, neighborhood/amenity/rating/price filters and sorting (all in the URL, filtered in Postgres), split/grid/map layouts, paging |
| `/shops/[slug]` | Gallery, amenities, details, your visit history, sharing |
| `/log-visit?shop=[slug]` | Star rating, visit time, duration, amenities, orders, notes, photos, recoverable drafts |
| `/me` | Visit journal, stats, favorites, work-friendly visits, saved shops, export, removal with Undo |

`/` redirects to `/shops`; the old `/my-shops` permanently redirects to `/me`.

## Data: what's live and what isn't yet

- **Shops** are served from Postgres. The seeded directory is the **sample set from
  the Stitch designs** — ratings, hours, distances, and the illustrated map are
  illustrative, not verified venue data.
- **The journal** (visits, bookmarks, drafts, photos) is still stored **in the browser**,
  per Clerk account or guest. `src/server/visits` and `src/server/ratings` already
  implement the database side; wiring the journal UI to them (and hosting photos) is
  the next step.

## Design and verification

- UI system: shadcn preset `bzDadqTHU` (Base UI · Luma · stone + amber · Lucide ·
  Figtree body / Nunito Sans headings). See [AGENTS.md](AGENTS.md) and the
  [cuptrail-shadcn skill](.claude/skills/cuptrail-shadcn/SKILL.md).
- [Original Stitch screens and source files](design/stitch/README.md)
- [Browser verification and screenshots](design/verification/README.md)
- [Approved Cuptrail mascot](public/brand/README.md)
