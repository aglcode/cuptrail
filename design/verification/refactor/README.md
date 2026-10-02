# Cuptrail UI refactor verification

Verified October 2, 2026, against the development app at localhost:3000 and the
production build at localhost:3001 using the Codex browser.

## Implementation

- `app/design-tokens.css`: shared cream, coffee brown, orange, sage, status,
  boundary, focus, spacing, radius, shadow, and motion tokens.
- `app/globals.css`: responsive shell, cards, map, journal, form, dialogs,
  notifications, loading and empty states; reduced-motion styles.
- `app/layout.tsx`: one locally hosted Manrope family and matching Clerk
  appearance, with the existing providers retained.
- `components/app-shell.tsx`, `discover.tsx`, `neighborhood-map.tsx`,
  `my-shops.tsx`, `visit-form.tsx`: navigation, welcome mascot, hierarchy,
  labels, concise copy, and readable controls.
- `components/dialog.tsx`, `shop-detail.tsx`: native dialog semantics,
  Escape and focus restoration, with Tab cycling through enabled controls.
- `app/error.tsx`, `loading.tsx`, `not-found.tsx`: consistent recovery states.
  The error boundary uses this Next.js version's documented `retry` callback.

The original routes, shop data, browser storage format, journal operations,
photo processing, Clerk authentication, proxy, Prisma/Neon setup, and database
contracts are retained. No dependencies were added, and no database schema,
environment files, or API contracts were changed. Existing unrelated edits were
left in place. Nothing was committed or deployed.

## Checks

All checks passed:

```sh
node node_modules/eslint/bin/eslint.js
node node_modules/typescript/bin/tsc --noEmit
node node_modules/next/dist/bin/next build
```

These invoke the existing lint/build scripts' tools directly because npm/npx
were unavailable in the terminal PATH. There is no existing test suite or test
script in this project.

- All four routes were checked at 375, 768, and 1440 pixels in both development
  and production. Each had one page heading, no horizontal document overflow,
  and no broken loaded images. Discovery also fits at 320 pixels.
- Search, neighborhood selection, combined amenity filters, reset, price
  filtering, alphabetical sorting, desktop grid/split switching, mobile
  list/map switching, map selection, zoom and reset work.
- Bookmarks appear in Saved for later. Journal search, favorites and
  work-friendly filters and grid/list layouts work.
- Filter and gallery dialogs cycle focus in both directions, skip disabled
  controls, close with Escape and return focus to their triggers. Gallery
  Previous/Next controls work. Ctrl+K focuses discovery search.
- Missing ratings announce a validation error and focus the star controls.
  Keyboard star selection and visible focus work. Native future-date
  validation blocks saving. Keyboard date edits persist in drafts.
- Ratings, amenities, custom drinks, notes, and a sample repository photo were
  entered. Draft restoration, switching between shops, photo persistence,
  visit saving, removal and Undo work. Verification visits, photos, bookmarks,
  and drafts were removed through the UI; the original example journal was
  restored.
- Missing shops show the not-found recovery view. Loading states were observed.
- Clerk sign-in opens with the existing providers and fields and the new theme.
- Theme text pairs meet 4.5:1 or better. Primary cream-on-brown text is 11.11:1,
  secondary text on muted surfaces is 5.54:1, and deep brown on orange is
  5.08:1. Form boundaries are at least 3.09:1 on all three warm surfaces.
- Reduced-motion CSS disables animations and transitions. The system motion
  preference was not changed during verification.
- No browser runtime errors were observed during the functional checks.

## Evidence and limits

`before/` contains the original representative screens. `after/` contains the
production page captures and development captures of dialogs, empty content,
form validation, and a populated form. `responsive.json` records the production
viewport measurements. Browser scrollbars account for the 15-pixel difference
between configured viewport widths and document content widths.

The existing directory is sample data and the journal is browser-local, as it
was before the refactor. No real Neon writes or OAuth login were attempted.
Signed-in Clerk account settings and the unexpected-error boundary were not
forced during browser verification. The export action shows its success
notification without a runtime error, but the browser tool did not return a
download event, so the downloaded JSON file's completion was not verified.
Below-the-fold photos remain lazy-loaded; full-page captures can show reserved
photo surfaces before those images enter the viewport.
