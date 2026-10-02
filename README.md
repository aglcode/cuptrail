# Cuptrail

Discover your next coffee corner and keep a personal journal of the places you
love. The desktop and mobile web MVP follows the Coffee Shop Finder App Stitch
designs, with Cuptrail's approved mascot and branding.

## Run locally

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```sh
npm run lint
npm run build
npm run start
```

Clerk authentication needs `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
`CLERK_SECRET_KEY` in `.env`. The existing Prisma/Neon layer uses `DATABASE_URL`.
Keep these variables in one environment file and never commit credentials.

## UI MVP

| Route | Experience |
| --- | --- |
| `/` | Search, neighborhood and amenity filters, sorting, saved shops, desktop split/grid views, mobile list/map views |
| `/shops/[slug]` | Shop gallery, amenities, illustrative details, personal visit history, sharing, and visit entry |
| `/log-visit?shop=[slug]` | Star rating, visit time, duration, amenities, orders, notes, photos, and recoverable drafts |
| `/my-shops` | Visit journal, statistics, favorites, work-friendly visits, saved shops, export, and removal with Undo |

The directory currently uses **sample shops from Stitch**. Ratings, opening
hours, distances, and the map are illustrative, not verified live venue data.

Visits, bookmarks, drafts, and photos are saved **in this browser**, separately
for each Clerk account or guest. Photos are resized before saving. Saving your
first visit replaces the example journal with your own entries. Export your
journal as JSON to keep a copy; there is no import feature yet.

The existing Prisma singleton, Neon schema, and Clerk just-in-time user sync are
preserved. This UI does not yet read or write shops, visits, ratings, or saved
lists in Neon. Real shop data, cross-device journal sync, and photo hosting are
the next integration steps. Native Expo/mobile clients remain future work; this
MVP is responsive web.

## Design and verification

- [All nine original Stitch screens and source files](design/stitch/README.md)
- [Screen IDs and hosted download URLs](design/stitch/manifest.json)
- [Browser verification and screenshots](design/verification/README.md)
- [Approved Cuptrail mascot](public/brand/README.md)

The app uses locally hosted Manrope and Newsreader fonts, optimized WebP photos,
native dialogs, labeled forms, keyboard-operable rating controls, focus states,
reduced-motion support, and mobile safe-area spacing.
