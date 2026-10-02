---
name: cuptrail-shadcn
description: Build or refactor Cuptrail UI using its shadcn bzDadqTHU preset, shared primitives, tokens, fonts, and accessibility conventions. Use for Cuptrail pages, forms, navigation, dialogs, and component styling; not for unrelated projects or database-only work.
---

# Cuptrail shadcn UI

Read the repository's AGENTS.md and relevant installed Next.js guides before editing. Preserve existing features, Clerk authentication, providers, validation, storage, API integrations, and routing.

## Preset and sources

User-selected setup command:

```sh
npx shadcn@latest init --preset bzDadqTHU --template next
```

Resolved choices: Luma style; stone base; amber theme and charts; Lucide icons; medium radius; Figtree body font; Nunito Sans heading font; default menu color; subtle menu accent. Cuptrail uses Base UI primitives (`--base base`). The preset code does not encode the primitive library.

Read `components.json` and the actual files in `src/components/ui/` before composing controls. Base UI uses `render` composition rather than Radix `asChild`; use the installed component types instead of assuming another library's API. The project `Icon` adapter maps existing semantic names to Lucide.

- Reuse local shadcn Button, Input, Textarea, Checkbox, NativeSelect, Toggle, Card, Badge, Tabs, and Dialog primitives as appropriate. Add missing components with `npx shadcn@latest add <component>`; inspect the CLI diff when updating customized files.
- Use `cn` from `@/lib/utils` to merge utility classes. Keep domain logic in the existing components/providers; UI primitives should remain reusable.
- `src/app/shadcn-theme.css` contains the generated preset colors and radii. `src/app/design-tokens.css` maps app-specific roles and spacing. Put layout rules in `src/app/globals.css`, without overriding primitive typography, shapes, or interaction states unnecessarily.
- `--muted` and `--accent` are surface colors. Use `--muted-foreground` and `--accent-foreground` for text, and `--primary-foreground` on amber actions. Use semantic foregrounds on overlays and status surfaces; do not infer that white text is legible on amber.
- Fonts are local assets loaded by `next/font/local` in `src/app/layout.tsx`. Use Figtree for body and controls, Nunito Sans for headings. Keep font licenses with the files and avoid build-time font downloads.

The preset overrides palette, typography, and radius suggestions in `CUPTRAIL-UI-REFACTOR.md`. Retain the guide's mascot, welcoming coffee identity, content hierarchy, generous spacing, responsive behavior, and accessibility requirements. Do not replace or recolor the mascot to match a theme.

## Safe composition and verification

Use explicit button types inside forms; keep every input labeled, controlled values synchronized, required/error associations intact, and loading/disabled states functional. Retain the native date input, star-rating radio semantics, upload limits, and per-shop draft behavior. Dialogs need accessible titles, focus containment, Escape dismissal, and focus restoration. Keep labeled icon buttons and usable touch targets around 44px.

After a material UI change, run ESLint, TypeScript, and the production build. Check affected routes at desktop and mobile sizes for overflow, contrast, focus, and images. Exercise changed interactions such as filtering, bookmarking, draft restoration, save/remove/undo, gallery navigation, and sign-in entry. Report any external auth or integration flow that could not be exercised.

For a future preset switch, inspect `npx shadcn@latest preset decode <code> --json` and the current configuration first. Apply changes in place with the CLI's supported preset workflow, review generated diffs, and preserve custom layout/providers/fonts. Do not run init or overwrite primitives merely to add a control.
