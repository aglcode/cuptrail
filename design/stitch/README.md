# Cuptrail Stitch references

Project: **Coffee Shop Finder App** (`608711120162096693`).

All nine requested screens were retrieved through the Stitch MCP. The original
HTML/SVG and screenshots are preserved here, with screen IDs and download URLs
in `manifest.json`. `assets.json` records the photos used in the implementation.

The responsive UI keeps Stitch's warm cream, espresso, and terracotta palette,
Manrope body type, Newsreader headings, desktop split discovery view, mobile
navigation, photo detail layout, journal cards, and visit form. Cuptrail's
previously approved mascot remains the app identity.

Optimized shop photos and the illustrative map are in `public/images`; local
font files are in `app/fonts`. To reproduce their download and optimization:

```sh
node scripts/download-stitch-assets.mjs
```

This script uses `curl.exe -L` and Sharp. The downloaded fonts use their actual
TrueType extension; `next/font/local` serves them without Google font requests.

The directory uses fictional/sample data supplied by the design. Ratings,
hours, map markers, and distances are explicitly illustrative. Saved shops,
visits, draft notes, and resized uploaded photos live in browser storage,
namespaced for each Clerk account or guest. They do not currently sync to Neon.
