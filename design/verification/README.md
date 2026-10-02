# UI MVP verification

Verified in the Codex browser against the running Next.js app.

## Checks

- Production build succeeds; TypeScript and repository ESLint checks pass.
- Discovery, My Logged Shops, Shop Detail, and Log Visit fit widths of 320,
  390, 768, 1024, and 1440 pixels, with no document overflow or broken loaded
  images (20 route/viewport combinations).
- Search updates the result count; combined filters produce the correct empty
  state; clearing filters restores results; price filtering works.
- Filter and photo dialogs expose labels, isolate focus, and close normally.
- Bookmarks update and appear in the saved list; mobile map/list switching works.
- Missing ratings block saving and focus the star control; selecting a rating,
  amenity, drink, and note updates the form and character counter.
- Draft fields survive reload.
- A local sample WebP photo attaches, is resized, and persists with a saved visit.
- A completed visit updates journal counts, rating, and cards and survives reload.
- Visit removal and Undo both work. The verification entry and bookmark were
  removed after testing, and the example journal was restored.

Screenshots in this directory show the implemented desktop and mobile UI.
The preview uses Clerk development authentication and device-local sample data;
real business data and Neon synchronization require a later integration.
