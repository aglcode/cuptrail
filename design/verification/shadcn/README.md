# shadcn preset verification

Cuptrail was initialized in place using shadcn CLI 4.21.1, preset `bzDadqTHU`, Next template, and Base UI primitives. The CLI resolved Luma, stone, amber, Lucide, medium radius, Figtree body text, Nunito Sans headings, default menus, and subtle menu accents.

## Completed checks

- ESLint and TypeScript.
- Production Turbopack build, including the directory, journal, not-found route, and five shop detail pages. The sandboxed build's Windows worker crashed; the build completed outside the sandbox.
- `npm run test:ui`: real React components and Base UI primitives rendered in jsdom. Tests exercise search, sorting, amenity/price filters, map controls, bookmarks, journal tabs, rating/date/upload validation, drafts, saving, removal/undo, account isolation, gallery controls, Escape dismissal, and explicit focus restoration. See `dom-results.json`.
- Skill frontmatter parsed with `js-yaml`; name/description/scaffold validation passed. Codex's Python validator could not run because its runtime lacks PyYAML.
- Source-token contrast checks passed for body text, supporting text on stone and amber-tinted surfaces, primary actions, and field boundaries. See `contrast.json`; this is not a rendered-page accessibility audit.
- No changes to the journal provider, shop data, Prisma, or auth proxy. Existing dependency versions are unchanged; the user's dev port 3002 is preserved.

## Limits

The in-app browser refused access because it could not verify its admin-enforced security policy. No browser screenshots or responsive visual checks were completed for this preset change. The isolated DOM tests stub Next routing/images and Clerk identity; they do not verify real OAuth, image decoding/resizing, completed downloads, native browser focus containment, or actual layout at mobile/desktop breakpoints. Earlier refactor screenshots belong to the previous visual theme.

The generated preset lives in `app/shadcn-theme.css`; product aliases live in `app/design-tokens.css`. Stronger focus outlines, field borders, supporting text, and action hover contrast are accessibility additions. Dialog portals sit above the mobile navigation. Local font files and their OFL licenses avoid external font requests during builds.
