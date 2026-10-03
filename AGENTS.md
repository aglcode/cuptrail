<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- Everything below is maintained by hand. Keep it OUTSIDE the block above — `next dev` rewrites that block and will discard anything placed inside it. -->

# Cuptrail

A coffee-shop finder: log, rate, and discover coffee shops by amenities and location, with search and filtering. Currently a personal-use web app; a community layer (public profiles, follows, visibility tiers) and a React Native (Expo) mobile client are planned for later.

## Stack

- **Next.js 16.3.8** (App Router, Turbopack), **React 19.2**
- **Prisma 7.10** ORM with the **Neon serverless driver adapter** (`@prisma/adapter-neon`)
- **Neon** Postgres (cloud, Southeast Asia region) — the only database
- **Clerk** (`@clerk/nextjs` 7) for auth (Google OAuth), with just-in-time sync into the app's own `User` table
- **Tailwind CSS 4**, TypeScript 5

## How a request flows

1. **`src/proxy.ts`** runs `clerkMiddleware()` on every matched request — Clerk's gatekeeper; it attaches auth context.
2. A route in **`src/app/`** handles the request. The root `src/app/layout.tsx` holds `<html>`, fonts, `<ClerkProvider>`, and globals; each route group adds its own chrome. Routes stay thin: they parse params, call `src/server/*`, and render `src/components/*`.
3. Clerk owns the **identity** (email, name, avatar, the `user_…` ID) on Clerk's servers.
4. **`getUser()`** (`src/lib/auth.ts`) returns the app's `User` row for the signed-in user: `auth()` reads the session locally, then one primary-key lookup; Clerk's rate-limited Backend API is only called the first time a user is seen (just-in-time sync). It is memoized per request. `requireUser()` throws when signed out.
5. **`src/server/<domain>/`** → **Prisma** → **Neon**: all app data (`User`, `Shop`, `Visit`, `Rating`, `Follow`) lives in Neon.

Clerk owns *who the user is*; Neon owns *what the user does*. Everything in the data model links to a user via the synced `User.id` (= Clerk's ID), which is why auth was swappable without touching the schema.

## Layout & conventions

```
prisma/            schema.prisma + seed.ts only
src/app/           routes only; route groups (folders in parentheses) don't change URLs
  (marketing)/     public pages with their own header/footer — page.tsx is the landing page at /
  (app)/           the product (shops/, shops/[slug]/, me/, log-visit/); layout adds JournalProvider + AppHeader/AppFooter
  api/shops/       GET route handlers
  not-found.tsx    unmatched URLs (renders the app chrome itself); (app)/not-found.tsx handles notFound() in app routes
src/components/    ui/ (primitives + Icon), shops/ (features), layout/ (app chrome, 404 body), marketing/, early-access/, providers/
src/server/        server-only data access by domain: shops/, visits/, ratings/
src/lib/           prisma.ts, auth.ts, and small shared helpers (utils, geo, slug, …)
src/hooks/         client hooks
src/types/         shared UI-facing types (DB row types stay in @prisma/client)
src/proxy.ts       Clerk middleware
```

- **Path aliases:** `@/*` → `src/*`; `@public/*` → `public/*` for static image imports (see `tsconfig.json`).
- **Data access boundary:** pages and components never import Prisma. Reads live in `src/server/<domain>/queries.ts`; mutations in `src/server/<domain>/actions.ts` (`"use server"`). Actions validate input with zod (schemas in a sibling `schemas.ts`, since `"use server"` files may only export async functions), check auth via `getUser()`, scope writes by `userId`, and return `ActionResult` (`src/server/action-result.ts`) for expected failures. Server-only modules start with `import "server-only"`.
- **Where pages go:** product routes under `src/app/(app)/`, public/marketing pages under `src/app/(marketing)/`. Keep Clerk's `<Show>`/`SignInButton` inside client components (`src/components/layout/header-account.tsx`): rendered from a server component they read the session and make the page dynamic, which would stop the landing page from being static.
- **Client reads:** client components fetch through GET route handlers in `src/app/api/` (CDN-cacheable), not server actions.
- **Query hygiene:** select only needed columns (`shopViewSelect`), filter/sort/paginate in SQL, cap every page size, and end every `orderBy` on `id` so pages are stable.
- **Denormalized ratings:** `Shop.ratingSum/ratingCount/ratingAvg` are written only by `src/server/ratings/actions.ts`, inside a transaction that locks the shop row (`SELECT … FOR UPDATE`).
- **Discover state** lives in the URL (`src/lib/shop-filters.ts` serializes, `src/server/shops/filters.ts` parses leniently with zod).
- **Prisma client singleton:** `src/lib/prisma.ts` — constructs `PrismaClient` with the `PrismaNeon` adapter and sets `neonConfig.webSocketConstructor = ws` (Node 20 has no global WebSocket). Always import `prisma` from there; never `new PrismaClient()` in app code (hot reload would open many pools). One-off scripts like `prisma/seed.ts` build their own client.
- **`src/proxy.ts` must sit beside `src/app/`.** In Next.js 16 middleware was renamed to `proxy`; a proxy anywhere else, or named `middleware.ts`, is not detected and Clerk throws "can't detect clerkMiddleware()". It is only picked up at dev-server startup — restart `npm run dev` after changing it. Keep no `app/` or `pages/` directory at the repo root: Next ignores `src/app` if one exists.
- **Prisma 7 datasource:** `schema.prisma`'s `datasource` block has **no `url`** — the connection string lives in `prisma7.config.ts` (`datasource.url` from `DATABASE_URL`). Do not re-add `url` to the schema; v7 rejects it.
- **Schema changes:** this project uses `db push` (no `prisma/migrations` dir yet). After editing `schema.prisma`, run `npx prisma generate` then `npm run db:push`. Keep the `Amenity` enum in sync with `src/types` and `src/lib/amenities.ts` (the shop mapper fails to type-check if they drift).
- **Env vars** (in `.env`, gitignored; never commit): `DATABASE_URL` (Neon), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`. Only one file should define auth/DB vars — `.env.local` and `.env.development` override `.env`, so keep auth vars in one place to avoid shadowing. `.env.example` is the committed template.
- **Early access:** `NEXT_PUBLIC_EARLY_ACCESS=true` (set for Production only in Vercel; inlined at build, so it needs a redeploy) makes `HeaderAccount` render `src/components/early-access/` instead of the sign-in button: a floating alert whose form calls Clerk's `joinWaitlist`. The flag only changes the UI — the enforcement is Clerk's **Waitlist** sign-up mode in the dashboard, which is instance-wide (local dev shares the instance). Unset means normal sign-in.

## Commands

- `npm run dev` — start the dev server at `http://localhost:4000` (restart it after any `.env` or `src/proxy.ts` change)
- `npm run build` / `npm run start` — production start also uses port 4000
- `npm run lint`
- `npm run format` / `npm run format:check` — Prettier (with Tailwind class sorting). VS Code formats on save via `.vscode/settings.json`; keep markdown hand-formatted (ignored). Formatting-only commits go in `.git-blame-ignore-revs`.
- `npm run test:ui` — isolated React/Base UI interaction regressions against `scripts/fixtures/shops.json` (Next, Clerk, and `fetch` are stubbed; no DB or real user data is touched)
- `npx prisma generate` → `npm run db:push` — sync schema to Neon (`postinstall` also runs `prisma generate`)
- `npm run db:seed` — upsert the sample shops (idempotent)
- `npm run db:studio` — browse/edit data

## UI system: shadcn preset bzDadqTHU

Use this preset for Cuptrail UI development:

```sh
npx shadcn@latest init --preset bzDadqTHU --template next
```

The installed configuration is **Base UI + Luma**, **stone** base, **amber** theme/chart accents, **Lucide** icons, **medium** radius, **Figtree** body text, and **Nunito Sans** headings. Menu color is `default` and menu accent is `subtle`. The preset code does not select the primitive library; this project uses `--base base`.

- Read [the Cuptrail shadcn skill](.agents/skills/cuptrail-shadcn/SKILL.md) for UI work. Its Claude copy is under `.claude/skills/cuptrail-shadcn/`.
- `components.json` is the CLI configuration; reuse primitives in `src/components/ui/` and `cn` from `src/lib/utils.ts`. Add missing primitives with `npx shadcn@latest add <component>`.
- `src/app/shadcn-theme.css` owns preset tokens; `src/app/design-tokens.css` maps Cuptrail-specific roles to them. Use `--muted-foreground` for text and `--muted` for surfaces; amber primary actions use `--primary-foreground`.
- Fonts are self-hosted through `next/font/local` in `src/app/layout.tsx`. Preserve both preset families and their licenses under `src/app/fonts/`.
- The preset supersedes earlier palette/font/radius suggestions in `CUPTRAIL-UI-REFACTOR.md`; retain its product identity, mascot, responsive layout, accessibility, and feature-preservation requirements.
- Do not rerun `init` for ordinary UI changes. Review a preset switch before applying it; preserve custom components, providers, routes, Clerk appearance, and existing state/API behavior.

## Prisma skills

The `prisma-*` skills under `.agents/`, `.claude/`, and `.windsurf/` are vendored from `prisma/skills` (GitHub) and tracked by content hash in `skills-lock.json`. **Do not hand-edit them** — that breaks the hash. Re-sync with the Prisma skills tool to update. They are already Prisma-7-oriented (`prisma-upgrade-v7`, `prisma-orm-setup`, `prisma-driver-adapter-implementation`), which matches this stack.

## Known follow-ups

- **Journal is still device-local.** Visits, stars, saved shops, drafts, and photos live in localStorage (`src/components/providers/journal-provider.tsx`). `src/server/visits` and `src/server/ratings` implement the DB side, but moving the UI needs a `SavedShop` model, Visit fields for duration/orders/amenities, and blob storage for photos (they are data-URLs today).
- **Scaling notes in code:** text search uses `ILIKE` (add a `pg_trgm` GIN index), "Nearest" ranks up to 2,000 candidates in memory (move to PostGIS KNN), and the log-visit shop picker is capped at 500 options (make it a search combobox). Each is commented at its call site.
- **No migrations yet:** adopt `prisma migrate` before the database holds real user data.
- **Clerk profile drift:** `getUser()` only copies name/email/avatar on first sight; add a Clerk `user.updated` webhook. `User.emailVerified` is a NextAuth leftover.
- **Server actions have no rate limiting** yet.
- The shop gallery is hardcoded for `kona-and-clay` in `shop-detail.tsx` (needs a `ShopPhoto` model).
- Unused Manrope/Newsreader font files remain in `src/app/fonts/` (only Figtree and Nunito Sans are loaded), along with `scripts/download-stitch-assets.mjs` that fetches them.
- Unknown `/shops/[slug]` URLs return HTTP 200 with a `noindex` tag rather than 404, because the root `loading.tsx` makes responses stream (documented Next.js behavior).
