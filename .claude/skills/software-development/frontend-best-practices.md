Frontend Best Practices

A standing checklist Claude applies to every piece of frontend work — generating new code, editing existing code, or reviewing/critiquing code the user pastes in. The goal is that frontend output is accessible, performant, and structurally sound by default, not as an afterthought.

When this applies
Writing or editing any markup, styles, or UI component code.
Reviewing pasted frontend code, a diff, or a PR — flag issues even if not asked to.
Answering conceptual questions about HTML/CSS/JS/frontend architecture.
Debugging a UI/layout/rendering issue — check whether the root cause or the fix touches any checklist item below.

This applies regardless of framework (React, Vue, Svelte, Angular, plain HTML/JS) unless the user's own project conventions override a specific point below (e.g., their codebase uses CSS Modules instead of utility classes — follow their existing convention over the default lean).

Core workflow
Before writing code: skim the relevant checklist sections below. For anything non-trivial (forms, interactive widgets, non-trivial layout), open the matching references/ file for the full audit checklist.
While writing code: apply the checklist inline — don't bolt it on after.
After writing code, or when reviewing pasted code: do a pass against the checklist and call out anything unresolved (either fix it, or explicitly note the trade-off/why it's out of scope). Don't silently ship inaccessible or unstructured markup.
When reviewing: even if the user only asked about one thing (e.g., "why is this layout breaking?"), briefly flag other checklist violations you notice — one or two lines each, not a full audit dump, unless they ask for a full review.
Accessibility — full audit mindset (default: WCAG 2.1/2.2 AA)

Treat every piece of UI code as if it will be audited. Load references/accessibility.md for the full checklist before building anything with forms, custom widgets, modals, or non-trivial interaction. Quick-reference must-haves for every task:

Semantic HTML first. Use the native element that matches the behavior (<button>, <a>, <nav>, <dialog>, <label>, etc.) before reaching for a <div> + ARIA + JS. ARIA is a fallback, not a default.
Keyboard operability. Everything interactive must be reachable and operable via keyboard alone — correct tab order, visible focus states (never outline: none without a replacement), no keyboard traps.
Labels & names. Every input has a associated <label> (or aria-label/aria-labelledby when a visible label truly can't be used). Every icon-only button has an accessible name.
Color contrast. Text meets 4.5:1 (3:1 for large text) against its background; don't rely on color alone to convey state (errors, required fields, links).
Images & media. Meaningful images get descriptive alt; decorative images get alt="".
Dynamic content. Live regions (aria-live) for content that changes without a page reload when the user needs to know (toasts, errors, async results).
Structure. Logical heading hierarchy (no skipped levels), landmark regions (<main>, <nav>, <header>, <footer>), correct list markup for lists.

Flag violations of any of these even in code the user didn't ask you to audit.

Performance & Core Web Vitals

Load references/performance.md for a deeper checklist on data-heavy pages, image-heavy pages, or anything with client-side routing. Default checks for every task:

Images: correct sizing/srcset, lazy-loading below the fold (loading="lazy"), modern formats where feasible, explicit width/height (or aspect-ratio) to prevent layout shift (CLS).
JS cost: avoid shipping unnecessary client-side JS for content that could be static/server-rendered; code-split/lazy-load rarely-used or heavy components.
Render-blocking: don't block first paint on non-critical CSS/JS/fonts; use font-display: swap (or equivalent) for web fonts.
Layout stability: reserve space for async content (images, ads, embeds) to avoid CLS; avoid layout thrashing (batch DOM reads/writes).
Interaction responsiveness: keep the main thread free for long-running work (debounce/throttle expensive handlers, avoid heavy synchronous work on input/click handlers) to protect INP.
CSS architecture — utility-first by default

Default lean is utility-first (Tailwind-style) unless the user's existing project uses a different convention (CSS Modules, BEM, styled-components, etc.) — match their codebase over this default. Load references/css-architecture.md for the fuller guide. Quick defaults:

Compose from utility classes rather than writing new custom CSS for one-off styling.
Extract a component/abstraction when a utility combination repeats 3+ times, rather than duplicating long class strings.
Keep responsive/state variants (hover, focus, dark mode, breakpoints) inline via utility modifiers rather than separate stylesheets/media query blocks, where the tooling supports it.
Still respect the semantic/accessibility rules above — utility-first is a styling mechanism, not a reason to reach for non-semantic elements.
Structure & code quality

Load references/code-structure.md for the fuller guide (component boundaries, state placement, naming). Defaults for every task:

Components/functions have a single clear responsibility; split when a component is doing markup + heavy business logic + data fetching all at once.
Props/inputs are typed where the language/tooling supports it (TypeScript, PropTypes, etc.).
No dead code, commented-out blocks, or console logs left in generated code.
Meaningful, consistent naming (no data2, handleClick1).
Error and loading states are handled for anything async — don't generate a component that only renders the happy path.
Review mode (pasted / existing code)

When the user pastes code or points at a file for feedback, debugging, or review:

Run it against the checklist sections above relevant to what's there (skip performance checks on a static presentational component with no images/async, etc.).
Report findings grouped by severity: accessibility blockers (keyboard/screen-reader breaking) first, then performance issues, then structure/style nits.
Give a concrete fix (a snippet or a specific instruction), not just "improve accessibility here."
If the user only asked about one specific bug, answer that directly first — then add a short "also noticed" section for anything else material, rather than leading with an unsolicited audit.