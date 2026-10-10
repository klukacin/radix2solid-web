# Radix2Solid website

The independent, unofficial native **Solid 2** documentation website for [Radix2Solid](https://github.com/klukacin/radix2solid). This is not a WorkOS product. Original Radix documentation, designs, blog posts and case studies keep their attribution and historical context; they do not endorse this fork.

The site preserves 137 MDX documents, 151 routes plus 404, 215 demo source files and 92 downloadable runnable sandboxes. It includes native interactive examples, API tables, Markdown negotiation, heading-aware search, redirects, the Themes playground and historical marketing/example layouts. Website source and issues belong to [klukacin/radix2solid-web](https://github.com/klukacin/radix2solid-web); native package issues belong to [klukacin/radix2solid](https://github.com/klukacin/radix2solid).

## Build and check

Use Node **24.21.0** and pnpm **11.5.0**, matching `.node-version` and `packageManager`.

```sh
pnpm bootstrap
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm check
pnpm dev
```

`bootstrap` reads the fixed public repository and full commit from `library-source.json`, then prepares ignored `.library/` before installation. That exact library commit must be published for the default HTTPS fetch to succeed. It does not fall back to a branch, npm or copied source. An existing checkout must have the pinned HEAD and no staged, unstaged or nonignored untracked changes; wrong HEAD, dirt, symlinks, non-Git directories and invalid/replaced pins fail without resetting or overwriting existing data. Ignored `dist/` and `node_modules/` outputs are allowed.

Install **once at this web root**, not inside `.library`. The workspace contains `apps/website` and the three actual `.library/packages/*` producers. Build validates the checkout again, then builds real primitives → icons → themes distributions before the site. There are no library source aliases, React bridge, Solid 1 runtime or second library-root dependency installation. The web lock retains the accepted producer dependency resolutions and native RC.13 overrides.

### Explicit local sibling prepopulation

If the pinned source has not been published yet, a real local sibling clone is an explicit alternative:

```sh
git clone --no-hardlinks ../radix2solid .library
git -C .library checkout --detach 85c98e99aea025a7ce20c3ab3c77f3269c680e94
pnpm bootstrap
pnpm install --frozen-lockfile
pnpm check
```

This assumes `../radix2solid` is the actual source repository containing that commit. It is **local-source validation, not proof of a remote-only GitHub checkout**. Bootstrap itself is unchanged and has no transport flags.

To update the library, review an actual clean library commit, update `library-source.json` with its full SHA, check the owned `.library` checkout is clean, and explicitly fetch/check out the new commit detached. Bootstrap deliberately rejects the old checkout after a pin change; it never silently recovers it. Retain the accepted root lock resolutions when updating workspace importers, then repeat the real producer/site checks.

## Verification scope

`pnpm check` builds real producers, typechecks the site, checks exact HTML/Markdown/document/demo/archive inventories, compiles native documented fences and installation commands, exercises copied guides, independently installs/builds **all 92 actual exported archives**, and runs bootstrap safety, existing worker/script tests and website browser cases in Chromium, Firefox and WebKit. Archive first installs have no pre-existing lock; each normal isolated install creates its own. Package names, declared native/runtime/tool pins and real tarballs remain exact. Archive installation/build coverage is not a claim that every archive received runtime interaction tests.

Runtime interactions reuse three representative built archives—`dialog-css`, `toast-css-modules` and `select-tailwind`—in all three engines (nine family/engine scenes). This is deliberately separate from the 92-archive installation/build count.

Preview binds only to `http://127.0.0.1:4149/`. Playwright owns its preview process; stop a manually started preview before browser checks. The library gallery is not part of this repository or its browser server configuration. Site implementation, focused commands and coverage limits are documented in [apps/website/README.md](apps/website/README.md).

## License, assets and publication limits

Native fork changes: MIT, Copyright (c) 2026 Radix2Solid contributors; see [LICENSE](LICENSE). Original website software keeps its full WorkOS MIT text in [WEBSITE-LICENSE.txt](apps/website/public/WEBSITE-LICENSE.txt). Package tarballs preserve the library's complete original and contributor notices, including reused released Colors CSS. Font copyright/OFL texts and provenance hashes are in `apps/website/public/fonts/`.

[NOTICE.txt](apps/website/public/NOTICE.txt) discloses historical trademarks, portraits, endorsements and externally hosted images. Software licensing does not grant trademark/likeness/deployment rights. The static site remains `noindex`; no production domain, analytics, account, deployment, npm publication or GitHub Release upload is configured or claimed. Generated exports, downloads, dependencies, the ignored library checkout and private build artifacts are not committed.
