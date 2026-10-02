@AGENTS.md

# Notes for Claude Code

## Cuptrail UI preset

Use shadcn preset **bzDadqTHU** for future components and styling:

```sh
npx shadcn@latest init --preset bzDadqTHU --template next
```

This project uses **Base UI / Luma**, stone + amber, Lucide, medium corners, Figtree body text, and Nunito Sans headings. Follow [cuptrail-shadcn](.claude/skills/cuptrail-shadcn/SKILL.md), reuse `src/components/ui/`, and add primitives with `npx shadcn@latest add <component>`. Read AGENTS.md for token ownership, preservation rules, and the full preset configuration. Do not reinitialize the existing app for routine component work.

The project context, stack, architecture, conventions, and known cleanup items all live in `AGENTS.md` (imported above) — treat that as the source of truth and keep it, not this file, up to date as the project evolves.

A few reminders specific to working here:

- Prefer plan mode with step-by-step diffs; explain each change before applying it.
- After editing `schema.prisma`, run `npx prisma generate` then `npx prisma db push` — there are no migration files to create.
- Restart `npm run dev` after any change to `.env*` or `src/proxy.ts`; neither is hot-reloaded.
- Pages and components never import Prisma: reads go in `src/server/<domain>/queries.ts`, writes in `src/server/<domain>/actions.ts`.
- Don't re-add `url` to the Prisma `datasource` block — on Prisma 7 the connection string lives in `prisma7.config.ts`.
- Don't hand-edit the vendored `prisma-*` skills; they're hash-tracked in `skills-lock.json`.
