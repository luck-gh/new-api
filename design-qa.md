# NEWAPI public pages design QA

## Source truth

- NEWAPI visual reference: `newapi-docs-redesign/before/newapi-pricing-reference.png`
- Previous independent docs shell: `newapi-docs-redesign/before/docs-before.png`
- Target homepage reference: `shuaiapi-source-evidence/home/desktop/full-page.png`
- Native docs comparison: `newapi-docs-redesign/comparisons/newapi-style-vs-native-docs-light.png`
- Homepage comparison: `newapi-docs-redesign/comparisons/source-home-vs-newapi-home-dark.png`

## Verified implementation states

All screenshots use device pixel ratio 1.

- Desktop, 1424 px viewport: docs home in Chinese light/dark and English dark.
- Desktop, 1424 px viewport: English API reference and English guide pages.
- Desktop, 1424 px viewport: homepage in English light/dark and About in English light.
- Mobile, 390 px viewport: Chinese docs home and opened contents sheet.
- Evidence: `newapi-docs-redesign/after/docs-light-zh.png`, `docs-dark-zh.png`, `docs-dark-en.png`, `docs-api-dark-en.png`, `docs-guide-dark-en.png`, `home-dark-en.png`, `home-light-en.png`, `about-light-en.png`, `docs-mobile-light-zh.png`, and `docs-mobile-contents.png`.
- Captured page dimensions are recorded in `newapi-docs-redesign/after/summary.json`.

## Findings and fixes

### Pass 1

- P1: docs used an independent header, theme switch, language switch, and visual system. Fixed by replacing it with native TanStack routes inside NEWAPI `PublicLayout` and `PublicHeader`.
- P2: homepage was permanently dark and its new copy did not follow the navigation language. Fixed with NEWAPI semantic color tokens, i18n keys, eased motion, and reduced-motion support.
- P2: new About copy did not follow the navigation language. Fixed by moving visible copy into the project locale catalog.
- P2: non-Chinese API pages retained Chinese endpoint details. Fixed with localized endpoint descriptions and generic localized auth/routing/response guidance while preserving the extracted Chinese detail for Chinese users.

### Pass 2

- No actionable P0, P1, or P2 visual or interaction issues remain.
- Fonts, spacing, radius, borders, foreground/background colors, and control sizing follow the existing NEWAPI component and token system.
- Source imagery remains sharp and the homepage composition stays faithful to the captured reference without carrying over source branding.
- Core copy is localized; detailed original Chinese guide material remains available in a collapsed reference section where a complete translation is unavailable.

## Interaction and runtime checks

- Public navigation, system name/logo, theme switch, and language switch are the same components used elsewhere in NEWAPI.
- Docs search, sidebar navigation, API endpoint selection, code-language selection, copy controls, guide navigation, and mobile contents sheet were exercised in Chrome.
- Theme and language changes were verified on docs, homepage, API, guide, and About states.
- Desktop and mobile browser runs reported no severe console errors.
- Type checking, touched-file linting, production build, and browser QA passed.

final result: passed
