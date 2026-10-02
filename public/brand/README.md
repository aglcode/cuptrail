# Cuptrail mascot

`cuptrail-mascot.png` is Cuptrail's approved app face: a cute coffee cup whose body tapers into a rounded map pin, emerging from the lower-left corner of a square cream background. Use this selected image as the source for future branding; preserve its face, silhouette, composition, and square canvas.

The original 1254 × 1254 PNG was generated with the built-in imagegen tool and is preserved here without visual edits. The app header uses this asset through `next/image`. The browser favicon (`app/favicon.ico`, containing 16, 32, and 48 pixel versions), app icon (`app/icon.png`, 512 pixels), and Apple touch icon (`app/apple-icon.png`, 180 pixels) are resized copies of the same image.

When regenerating the favicon, encode each embedded PNG as RGBA (for example, call Sharp's `ensureAlpha()` before `png()`). Turbopack's ICO decoder requires RGBA PNG entries; an opaque alpha channel preserves the mascot's appearance.

## Intended palette

| Role | Color |
| --- | --- |
| Warm cream background | `#EDE4D8` |
| Caramel cup body and handle | `#C9864B` |
| Espresso coffee opening and facial marks | `#4B3026` |

These colors describe the mascot artwork.

## Final imagegen edit prompt

The selected image was the result of this final edit to the preceding coffee-cup/map-pin mascot image:

> Rebuild the silhouette geometry of this mascot to meet the bottom-left placement exactly. ONE square image. Preserve the same cute coffee cup with handle, coffee opening, two espresso dot eyes and tiny espresso smile, and a body that tapers into a round map-pin base. The MAP-PIN TIP is now at the BOTTOM-LEFT CANVAS CORNER, continuing slightly outside it. The body therefore fills the entire lower-left corner: there must be NO cream triangle or cream gap anywhere beside the lower-left corner. The left silhouette edge is OFF CANVAS all the way from the upper cup side to the bottom edge; the right side curves down and left into a blunt pin tip that is partially cropped at the bottom-left. This is an asymmetric crop of an upright character, not a character leaning or lying down. Redraw the face within the visible body so BOTH eyes remain fully visible. Keep the broad dark coffee opening and chunky right handle fully identifiable. The cup's visual vertical axis is far to the left of center and the character occupies about 90% of the canvas scale. Preserve the cup-to-rounded-pin concept and 4–7 shapes.
>
> Use completely FLAT, SOLID FILL colors, as in a clean vector graphic, with exactly these three colors and absolutely no variation within each flat region: background warm cream #EDE4D8; body and chunky handle caramel #C9864B; coffee opening, both eyes, tiny smile dark espresso #4B3026. No gradients, mottling, noise, texture or lighting effects anywhere, including background. Rounded soft shape geometry alone supplies the barely-perceptible depth. The background stays full-bleed, uniform and visible in the open top and right spaces. No outlines, no shadows, no steam, no pin hole, no new elements, no text, no border, no mask, no watermark. Normal square outer corners. Only one lovable baby-like mascot. Most crucial: the exact bottom-left canvas corner and all pixels immediately around it are solid caramel character.
