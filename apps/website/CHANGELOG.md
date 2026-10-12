# Changelog

## 0.0.0-local

- Make the site indexable: remove the `noindex` meta tag and `X-Robots-Tag` header from rendered pages, `_headers` and the preview server, and make `check:export` fail if either returns.
- Underline the inline todo-list links on the Colors custom palette page and the dashboard example, so they are distinguishable from surrounding text without relying on color (axe `link-in-text-block`, which flagged the Colors page in CI).
- Fix axe violations on the dashboard and ecommerce example pages and gate both in the settled accessibility test: decorative `alt=""` on the dashboard avatars (the person's name is always visible beside them); section headings now follow the page `h1` (`h2`, with `h3` sub-sections) at unchanged visual sizes; accessible names for the ecommerce icon buttons and select triggers; and underlined inline links that sat in heading or gray body text.
- Remove the costly 64px surface-Card backdrop blur on the standalone ecommerce example page only, because it made software-rendered WebKit take seconds per frame and stalled browser interactions. This is a localized, deliberate visual tradeoff (the backdrop behind those cards is no longer blurred); other pages are unchanged.
- Expose the ecommerce example's two Bookmark icon buttons' on/off state to assistive technology with `aria-pressed="true"|"false"` bound to the existing sneakers/jeans state (the icon and emphasis already changed visually, but the buttons were announced identically before and after toggling); the existing ecommerce end-to-end scenario now asserts both buttons toggle independently in Chromium, Firefox and WebKit.
- Filter hidden build paths relative to `dist/client` instead of the absolute path, so a checkout under a hidden directory copies its CSS and JavaScript; covered by a real build test.
- Point source, edit, issue, native-library and bootstrap URLs at the `wsagency` GitHub organization.
- Replace the Primitives accessibility overview's and Navigation Menu demos' claim of testing in "a wide selection"/"a range" of browsers and assistive technologies with the actual scope: automated axe and interaction checks on selected pages in Chromium, Firefox and WebKit, plus scoped Orca checks on Linux for Announce, Toast and Dialog.
- Add the authentic WS Agency sign, “Made with love by WS” creator/community credit and real project contact link to the shared footer and repository README, preserving original WorkOS/MIT notices and documenting the logo's separate brand-artwork license and provenance.
- Keep fixed homepage live-example controls inside their existing hero paint boundary, so the footer's agency link, sign and credit stay readable and clickable after keyboard scrolling without moving the primary header.
- Use actionable mobile header clicks after animated modal closes, retaining the initial viewport bounds, dialog and focus assertions.
- Native Solid 2 static rendering/hydration for all 137 MDX documents and 151 routes plus 404, including both component indexes; no React/Next runtime or bespoke client router.
- Use native Radix2Solid branding while retaining navigation and native Markdown acceptance independently of incidental asset filenames, presentation defaults and password-manager attribute wiring.
- Prepare the pinned native workspace with the dependency-free Node bootstrap before pnpm installation; builds validate the same checkout directly.
- Keep the shared document header's primary controls inside the initial mobile viewport by allowing its search label to ellipsize without changing its accessible name or functionality.
- Preserve original marketing, historical posts/case studies, complete Themes playground and dashboard/ecommerce/music layouts with attribution.
- Native live snippets, API metadata, code/style controls, 92 independent runnable sandbox downloads and licensed icon SVG/package downloads.
- Native desktop/mobile navigation, stored/system appearance, retryable heading-aware MiniSearch and static Markdown negotiation.
- Retain original Colors generation math, six palette query keys, cookies, URL precedence, copy/download and native validation, with no upstream analytics.
- Real export/link validation and copied animation/system-appearance CSR/SSR browser checks; native animation handles interruption/disposal/reduced motion.
- Tailwind sandbox entries import their generated stylesheet. Demo-local leaf-card composition retains Music App's original backdrop blur while restoring WebKit painting.
- Supply document metadata titles when Markdown has no primary heading, without duplicating existing source headings.
- Give live Select/Slider and shared Music controls accessible names, preserve meaningful portrait alternatives and consistent headings, and replace panel-less palette tabs with real document navigation.
- Keep code scroll regions keyboard-focusable and repeated live examples out of the landmark list. Dialog's three styling variants use readable green-12 action text.
- Retain real full-rule axe checks for settled gallery/document/palette/Music surfaces and opened modals. Announce and Toast/modal transitions were also exercised with real isolated Orca/AT-SPI/Speech Dispatcher/eSpeak NG speech and captured native audio; no all-reader/platform certification.
- Retain native type compilation for 560 actual fences in 107 documents, checked annotations on 627 rendered fences and nine package-matched installation commands; no mocked examples or type suppression.
- Pin document, demo, route and archive inventories in the site-owned coverage manifest; fresh checkouts create their own ignored guide/snippet fixtures.
- Replace all original proprietary font binaries with unmodified published OFL Inter, Source Serif 4 and JetBrains Mono WOFF2 assets; retain full copyright/license notices and verify source/built provenance and hashes.
- Clear generated static output before copying assets, so removed fonts cannot remain in the distribution.
- Correct the desktop hero's unitless heading multiplier; retain desktop/mobile heading hierarchy regression coverage in all three engines.
- Commit deferred ScrollArea viewport, scrollbar and corner measurements in an imperative native scope without changing observer/frame teardown or disabling development ownership guards; retain real viewport-resize and native-scroll regression coverage in all three engines.
- Initialize Colors scale hover from the hydrated native element, so hovering during script loading reveals its copy menu without requiring another mouse move; retain delayed-hydration regression coverage.
- Repair native keyed palette/dashboard focus, CSS property spelling, meaningful icon-control names, pin state and member-menu behavior without inventing mockup business handlers.
- Restore complete code/style/source-download presentation, current native metadata/composition/SSR guidance, navigation and heading-aware search; preserve historical posts and attribution.
- Preserve native hero/observer, clipboard and preview ownership; validate actual playground anchors and allow only explicit public package/SVG downloads.
- Name the desktop documentation landmark and underline Markdown links independently of color. Keep code-copy controls above highlighted code hit targets without changing clipboard permission/error handling.
