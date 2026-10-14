# Radix2Solid website implementation

Unofficial native Solid 2 documentation and examples, not the official Radix website or a WorkOS product. Historical original React blog posts, case studies, designs and endorsements retain attribution. Start with the [root bootstrap/install instructions](../../README.md).

The exact preserved inventory is owned by [`coverage-manifest.json`](coverage-manifest.json): 137 MDX documents, 151 routes plus 404, 215 demo files and 92 archives. Original route inventory was independently observed at the recorded full upstream commit; checks do not require an ignored upstream checkout or library-internal planning documents. Both component indexes have real HTML/Markdown routes.

## Commands from the web root

```sh
node scripts/prepare-library.ts
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm --filter @radix-solid/website check:export
pnpm --filter @radix-solid/website check:snippets
pnpm --filter @radix-solid/website check:examples
pnpm --filter @radix-solid/website check:sandboxes
pnpm --filter @radix-solid/website test
pnpm exec playwright test
node apps/website/scripts/check-dev.mjs
pnpm dev
```

Preview is `http://127.0.0.1:4149/`; stop a manual preview before Playwright starts its own, or set `WEBSITE_PREVIEW_PORT` (for example `WEBSITE_PREVIEW_PORT=4150 pnpm exec playwright test`) so the preview server, Playwright `baseURL`/readiness URL and `e2e/website.spec.ts` all use that port instead. Website browser checks retain Chromium, Firefox and WebKit, with no library gallery server.

`check-dev.mjs` is a separate regression check, not a website-serving command or an added CI case. After the existing bootstrap, install/build and Playwright browser setup, it uses the installed Vite and unchanged website configuration on a free local port, checks native homepage controls and Progress-document hydration/theme interactions in Chromium, Firefox and WebKit, then closes its browsers and servers. It targets the development-only ownership guards and SSR link-props regression, not all 151 routes; images remain live, so it is neither fully hermetic nor an image-delivery/Firefox ORB certification.

Trusted local MDX goes through `@mdx-js/mdx` in JSX-preserving mode and the native Solid compiler. String intrinsics and JSX stored in document data are normalized for native ownership; there is no React MDX runtime or bridge. Markdown conversion excludes navigation and hydration markers. MiniSearch retains hierarchical records, prefix/fuzzy matching and heading boosts. Navigation uses ordinary static links, not a custom SPA router.

Cloudflare dispatches all registered non-root page families to the existing Worker for `GET`/`HEAD` negotiation with `Accept: text/markdown` or `text/x-markdown`, returning their actual `.md` twins and `Vary: Accept`; default requests remain HTML and legacy redirects retain precedence. `/` is deliberately not negotiated. JavaScript, CSS, fonts, images and icon downloads keep the native static-assets fast path. The Node suite invokes the Worker directly with real exported assets, so it does not cover Cloudflare's assets-first dispatch: after routing changes, use the installed `pnpm --filter @radix-solid/website exec wrangler dev --local` with current `out/` and check both Accept values over GET and HEAD against the direct Markdown twins.

`check:export` checks exact source, route and archive inventories; HTML/Markdown twins; page/assets/anchors/search targets; indexability (no `noindex` meta or header), privacy and redirects; registered public artifacts; and licensed font hashes in both source and export. Builds clear their own generated `out/` before copying assets, filtering hidden paths relative to `dist/client` so a checkout under a hidden directory still exports its CSS and JavaScript. Public downloads are the four real package tarballs (Primitives, Icons, Themes, Charts), all declared archives and licensed SVG assets; hashed implementation paths stay private.

`check:snippets` compiles actual native JS/TS/JSX/TSX fences against real declarations/page imports/MDX components. Partial fences inherit documented scope; named neighbouring files come from their real sources, not mocks or ambient `any`. The accepted inventory contains 587 native fences across 129 documents, 659 rendered fences with checked annotations and eleven package installation commands. Colors styling resolves actual `@vanilla-extract/css@1.21.3`. `check:examples` builds independent native CSR/SSR fixtures from copied animation/system-appearance guides and exercises transitions, cancellation, disposal, reduced motion and media changes in all three engines. Both commands remove their owned fixtures.

`build-sandboxes.ts` packs real `.library/packages/{primitives,icons,themes,charts}` distributions and complete licenses while reading native pin policy from this web root. All 95 CSS, CSS Modules and Tailwind variants include exact declared Solid/web RC.15, plugin next.50 and Vite 8.3.3 pins; Themes resolves its unpublished primitives dependency to the same local tarball. Charts variants also vendor the Charts tarball and copy its `LICENSE` and `NOTICE`. Tailwind entries import their actual stylesheet. Extract a download, run `pnpm install`, then `pnpm dev` or `pnpm build`.

`check:sandboxes` independently extracts, normally installs and builds every actual exported archive in isolated workspaces, with two concurrent consumers and per-archive raw logs under ignored root `.artifacts/sandboxes/`. These first installs create locks; they are not frozen installs of non-existent locks. Full compile coverage does not imply all-archive runtime interaction coverage.

The same built consumers provide runtime scenes for exactly `dialog-css`, `toast-css-modules`, `select-tailwind` and `charts-css-modules` in Chromium, Firefox and WebKit: four families × three engines, not 95 runtime-tested archives. Real interaction readiness and unexpected console/page errors remain assertions.

Own primary marks, source/edit/issues controls, favicons and relative social card identify Radix2Solid. Labeled original links remain historical references. Rendered metadata is indexable and invents no canonical hostname or social account. Native synthesized speech was observed with Orca on Linux for Announce, Toast and Dialog; that limited observation is not human/all-reader/all-platform certification. Browser coverage is automated axe and interaction checks on selected pages in Chromium, Firefox and WebKit, not every component, platform or assistive technology.

Self-hosted fonts are unmodified, licensed WOFF2 assets from [Inter 4.1](https://github.com/rsms/inter/releases/tag/v4.1), [Source Serif 4.005](https://github.com/adobe-fonts/source-serif/releases/tag/4.005R) and [JetBrains Mono 2.304](https://github.com/JetBrains/JetBrainsMono/releases/tag/v2.304). Full copyright/OFL notices and provenance hashes are in `public/fonts/LICENSES.txt` and `public/fonts/manifest.json`. Original website MIT attribution in `public/WEBSITE-LICENSE.txt` covers the website code, not the photo fixtures. The 29 original-response free Unsplash fixtures under `e2e/fixtures/unsplash/` have their own [`LICENSE.txt`](../../e2e/fixtures/unsplash/LICENSE.txt) and exact URL, MIME, size and SHA-256 manifest; unknown image URLs fail the browser checks, while Unsplash+ and WorkOS requests remain live. The fixtures do not establish model/property clearance or correct production network delivery, and browser checks are not fully hermetic. Read [`public/NOTICE.txt`](public/NOTICE.txt) for historical asset rights and external-image/privacy limits. No analytics or registry publication is configured; deployment is described in the repository README.
