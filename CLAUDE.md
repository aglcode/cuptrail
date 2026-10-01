@AGENTS.md

# Notes for Claude Code

The project context, stack, architecture, conventions, and known cleanup items all live in `AGENTS.md` (imported above) — treat that as the source of truth and keep it, not this file, up to date as the project evolves.

A few reminders specific to working here:

- Prefer plan mode with step-by-step diffs; explain each change before applying it.
- After editing `schema.prisma`, run `npx prisma generate` then `npx prisma db push` — there are no migration files to create.
- Restart `npm run dev` after any change to `.env*` or `proxy.ts`; neither is hot-reloaded.
- Don't re-add `url` to the Prisma `datasource` block — on Prisma 7 the connection string lives in `prisma7.config.ts`.
- Don't hand-edit the vendored `prisma-*` skills; they're hash-tracked in `skills-lock.json`.