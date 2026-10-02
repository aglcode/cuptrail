# CupTrail UI Refactor — Cozy Playful Minimalism

## Your task

Refactor the existing CupTrail coffee app UI to follow the branding below. Inspect the repository first, then implement the changes in the actual code. Complete the refactor and verify it; do not stop at a design proposal or a plan.

This is an existing application. Preserve its working features, routes, API integrations, authentication, state, validation, and data behavior. Improve the visual system, layout, component styling, and appropriate interface copy. Do not rebuild the project from scratch or invent features to fill a design.

## Brand direction

**Cozy Playful Minimalism:** a warm, character-driven coffee app with generous whitespace, soft rounded geometry, earthy colors, and restrained, expressive mascot moments.

The CupTrail mascot is the visual anchor: an orange coffee cup with dark brown coffee, simple circular eyes, a curved smile, and a rounded handle against a warm cream background. Carry those qualities into the interface: welcoming, simple, relaxed, and easy to use.

Use clean editorial composition: clear headings, short supporting copy, deliberate spacing, and meaningful content as the focal point. Add calm character personality and specialty-coffee warmth. Keep the result polished enough for adults, with playfulness expressed through small details.

The desired feeling is **a friendly coffee companion**. Make the branding visible through composition, typography, surfaces, interactions, and the mascot—not just a color replacement.

## 1. Inspect before editing

- Read applicable `AGENTS.md` instructions and inspect the actual framework, styling approach, component library, routing, assets, theme configuration, and package scripts.
- Identify every existing user-facing page, shared layout, and major interactive state. Include authentication, settings, dialogs, empty states, loading states, and errors where present.
- Check the working tree and preserve unrelated user changes.
- Locate `cuptrail-mascot.png` or the existing mascot asset. Inspect it before choosing placement or cropping.
- Use the existing technology and reusable components. If the app uses Tailwind, shadcn, MUI, or plain CSS, implement the design through that system. Avoid major dependency upgrades or replacing the component library.
- If a running preview is available, capture representative before screenshots to compare later.

Resolve routine implementation decisions yourself. If the mascot is unavailable, continue the rest of the refactor and report the missing asset. Do not substitute an emoji or a different character as the brand mascot.

## 2. Establish shared design tokens

Centralize these values in the existing theme or a small shared token layer. The palette is a starting point based on the mascot, not a claim of exact sampled colors.

| Token | Starting value | Intended use |
| --- | --- | --- |
| Background | `#F7F1E7` | Main page canvas |
| Surface | `#FFFAF2` | Cards, forms, dialogs |
| Muted surface | `#EFE4D5` | Secondary sections, chips, selected backgrounds |
| Brand orange | `#D8863F` | Brand accents and selected highlights |
| Coffee brown | `#54301F` | Headings, primary text, dark actions |
| Deep brown | `#3C2418` | Strong emphasis and text on orange |
| Secondary brown | `#79503A` | Supporting text, subject to contrast checks |
| Sage | `#849271` | Occasional completion or positive accents |
| Border | `rgba(84, 48, 31, 0.12)` | Quiet component boundaries |
| Shadow | `0 8px 30px rgba(84, 48, 31, 0.06)` | Subtle elevation |

Treat these as semantic tokens rather than scattering hex values across components. Define interactive states, focus, disabled styling, and existing success/error/warning roles as well.

Brand orange and sage are accent colors, not automatically accessible text colors. Use cream text on coffee-brown primary buttons. Use deep-brown text on orange buttons only after verifying contrast. Avoid small white text on the proposed orange. Darken status foregrounds as needed and pair color with text or icons.

Use a spacing scale such as `4, 8, 12, 16, 24, 32, 48, 64px`. Prefer consistent spacing to one-off margins.

- Small controls and nested surfaces: roughly `12–16px` corner radii.
- Main cards: roughly `20–24px` corner radii.
- Dialogs and featured sections: up to `24–32px` where suitable.
- Buttons and small chips: pill shapes where they improve clarity.

Apply radii intentionally; nested controls should remain visually distinct. Use shadows sparingly and avoid elevating every surface.

## 3. Typography and hierarchy

Use one readable, friendly sans-serif family. Prefer a suitable font already in the project; if necessary, use a rounded family such as Nunito Sans with reliable fallbacks and appropriate loading. Do not introduce several decorative fonts.

- Use a restrained weight range, such as 400, 600, and 700.
- Keep body text around `16px` with comfortable line height.
- Use large, confident headings for introductions and important sections. Scale them down on mobile; preserve room for controls and actual content.
- Keep utility labels, tables, and dense lists readable rather than oversized.
- Use sentence case, clear labels, and short supporting paragraphs.
- Maintain a clear progression from page heading to section heading to body to metadata.

## 4. Layout and component treatment

Give the existing content a clear hierarchy and comfortable breathing room. Use responsive grids and sensible maximum widths. Keep reading areas narrower than data-heavy views.

**Navigation and app shell:** simplify visual clutter, give the active route a warm surface or orange accent with readable text, and make the main action easy to find. Preserve existing destinations. Adapt navigation to smaller screens without hiding essential actions.

**Cards and lists:** use cream surfaces, rounded corners, quiet boundaries, and clear content grouping. Let whitespace separate sections. Avoid putting every heading, statistic, and label inside its own card. Retain list or table layouts when they help users scan or compare information.

**Buttons:** provide distinct primary, secondary, and quiet variants. Use coffee brown for prominent actions, warm surfaces for secondary actions, and orange as a considered accent. Add hover, pressed, loading, disabled, and keyboard-focus states. Keep touch targets around `44px` or larger where practical.

**Inputs and filters:** use readable labels, warm surfaces, gentle borders, and clear focus states. Preserve validation messages and search/filter behavior. Do not replace labels with placeholders.

**Dialogs and menus:** use consistent typography and corner treatment. Preserve focus management, Escape behavior, outside-click behavior where applicable, and accessibility semantics provided by the current library.

**Existing coffee or café content:** make names, photos, locations, ratings, and actions easy to scan where those fields already exist. Preserve meaningful imagery and metadata. Keep the mascot distinct from user content.

**Charts and summaries, if present:** apply the brand palette while maintaining legible axes, labels, and distinguishable series. Preserve accurate data. Use friendly headings without removing necessary numbers or units.

Avoid glassmorphism, heavy gradients, neon colors, excessive blur, harsh black outlines, strong neo-brutalism, busy decoration, and generic corporate dashboard styling. Any soft shading in the original mascot can remain; it does not require gradient UI backgrounds.

## 5. Mascot integration

Use the supplied mascot intentionally in an existing welcome area, onboarding, or empty state. Additional placements should have a purpose. One prominent mascot moment per screen is generally enough; compact utility screens may need none.

- Preserve its identity, proportions, colors, and expression.
- Inspect the actual image bounds and transparency. The supplied reference is a close-up composition with a cream background; do not assume it is a transparent, full-body illustration.
- Display the full available image using appropriate sizing, or make a deliberate close-up placement that suits the layout. Do not accidentally clip its eyes, smile, or handle.
- If it has an opaque background, compose that background into a warm illustration panel rather than pretending it is a cutout. Do not stretch the image or use CSS filters to force a match.
- Reuse the asset from a stable repository path. Do not hardcode a temporary chat attachment path.
- Reserve image dimensions to avoid layout shifts. Use descriptive alt text when it conveys meaning and empty alt text when decorative.
- Do not fabricate expressions, achievement systems, or mascot features. Use existing assets and existing product states.

Keep important information in real text and accessible controls; the mascot supports the message.

## 6. Motion and interface copy

Use short, subtle transitions for hover, press, expansion, and screen content. Typical control transitions can be around `150–220ms`. Favor opacity and transform animations that do not shift surrounding content.

A small, occasional mascot entrance or response can add warmth if appropriate. Avoid endless bouncing or animating the entire mascot image to simulate a blink. Honor `prefers-reduced-motion`; keep reduced-motion states fully usable.

Use concise, natural copy. Preserve product meaning and terminology. Examples to adapt only when the corresponding feature exists:

- “No saved cafés yet” with a clear discovery action.
- “Your coffee week” above an existing weekly summary.
- “Something went wrong. Try again.” for a recoverable error.

Avoid exaggerated enthusiasm, repetitive coffee puns, vague marketing lines, and made-up statistics. Keep destructive-action wording and validation instructions explicit.

## 7. Implement across the existing app

1. Introduce shared tokens and theme foundations.
2. Refactor shared primitives and the app shell so the branding propagates consistently.
3. Update each existing page and major interaction state. Prioritize the main user journey, then finish secondary screens.
4. Remove obsolete styling that conflicts with the new system, including duplicated values and old variants that are no longer used.
5. Preserve component APIs when practical. Keep changes focused on the UI; do not alter backend contracts or business logic to make the design easier.

Preserve any existing theme preference or dark-mode support. If dark mode exists, provide corresponding warm brown surfaces and readable light text using semantic tokens. Do not add a theme switcher if none exists.

Do not replace live data with mocks, add unsupported routes, introduce new analytics, or silently remove controls. Do not commit or deploy unless separately requested.

## 8. Verify before finishing

- Run the repository's relevant build, lint, and type checks when available. Run existing tests related to changed behavior. Distinguish pre-existing failures from regressions.
- Inspect representative pages at approximately `375px`, `768px`, and `1440px` widths using available preview/browser tools.
- Check longer labels, empty content, loading, errors, populated lists, dialogs, and form validation where present.
- Verify navigation, searches, filters, forms, and primary actions still behave correctly.
- Check keyboard navigation, visible focus, accessible names, reduced motion, and text contrast. Target WCAG AA: `4.5:1` for normal text and `3:1` for large text; keep meaningful control boundaries and focus indicators visible.
- Confirm there is no unintended horizontal overflow, clipped content, stretched imagery, or layout shift caused by the mascot.
- Compare before and after views. Ensure the result has a coherent visual identity across screens, not just a redesigned homepage.

If a preview or verification tool is unavailable, complete the available checks and state the limitation precisely. Do not claim visual verification you did not perform.

## Completion criteria

- Existing functionality and data integrations remain intact.
- The app consistently uses warm cream surfaces, coffee-brown typography, restrained orange accents, friendly type, and soft geometry.
- Shared tokens and components carry the branding across existing pages and states.
- The mascot is integrated thoughtfully wherever the available asset supports it.
- Mobile layouts and accessible interaction states work.
- Relevant available checks pass, or outstanding issues are reported clearly.

Finish with a brief summary of what changed, the main files affected, the checks performed, and any remaining limitations. Implement the refactor now.
