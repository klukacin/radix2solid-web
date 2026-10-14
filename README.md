# Radix2Solid website

The independent, unofficial native **Solid 2** documentation website for [Radix2Solid](https://github.com/wsagency/radix2solid). This is not a WorkOS product. Original Radix documentation, designs, blog posts and case studies keep their attribution and historical context; they do not endorse this fork.

The site preserves 137 original MDX documents and 151 original routes, and adds 23 native-only documents and 24 native-only routes for Charts and Themes recipes: 160 documents, 175 routes plus 404, 222 demo source files and 95 downloadable runnable sandboxes. It includes native interactive examples, API tables, Markdown negotiation, heading-aware search, redirects, the Themes playground and historical marketing/example layouts. Website source and issues belong to [wsagency/radix2solid-web](https://github.com/wsagency/radix2solid-web); native package issues belong to [wsagency/radix2solid](https://github.com/wsagency/radix2solid).

## Created for WS Agency

<a href="https://ws.agency"><picture><source media="(prefers-color-scheme: dark)" srcset="https://design.ws.agency/assets/logos/original/sign-white.svg"><img src="https://design.ws.agency/assets/logos/original/sign-color.svg" height="32" alt="WS Agency"></picture></a>

**Made with love by WS.** Created by [Kristijan Lukačin (@klukacin)](https://github.com/klukacin) for [WS Agency](https://ws.agency). We love open source, enterprise development and AI. Have a project in mind? [Let’s build it together.](https://ws.agency/contact)

The WS Agency logo is trademark/brand artwork excluded from the software MIT license; the local Original color sign's public provenance and exact asset hash are in [NOTICE.txt](apps/website/public/NOTICE.txt). The README also uses the official [white sign](https://design.ws.agency/assets/logos/original/sign-white.svg), SHA-256 `f3e960eafbd9202aacc216dc3a4995fddc14e109d7e6d8ffc5c0f45c28fda72c`, from the same observed public design version; no brand artwork is relicensed. Original WorkOS attribution and the unofficial-fork status above remain unchanged.

### Contributing and credit

Website issues and pull requests belong in [radix2solid-web](https://github.com/wsagency/radix2solid-web); native package contributions belong in [radix2solid](https://github.com/wsagency/radix2solid). GitHub credits real accepted commits merged into the default branch when their author email is associated with the author's account; use your own verified account email or GitHub-provided noreply address. Add `Co-authored-by` only for someone who actually contributed, using their real identity.

Repository owners can invite collaborators through repository Settings to grant access. That invitation is separate from contributor credit and is not required to submit a fork pull request.

## Build and check

Use Node **24.21.0** and pnpm **11.5.0**, matching `.node-version` and `packageManager`.

```sh
node scripts/prepare-library.ts
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm check
pnpm dev
```

The dependency-free Node bootstrap reads the fixed public repository and full commit from `library-source.json`, then prepares ignored `.library/` before installation. Run it directly, before any pnpm command: pnpm can automatically install workspace dependencies before running a package script. That exact library commit must be published for the default HTTPS fetch to succeed. It does not fall back to a branch, npm or copied source. An existing checkout must have the pinned HEAD and no staged, unstaged or nonignored untracked changes; wrong HEAD, dirt, symlinks, non-Git directories and invalid/replaced pins fail without resetting or overwriting existing data. Ignored `dist/` and `node_modules/` outputs are allowed.

Install **once at this web root**, not inside `.library`. The workspace contains `apps/website` and the four actual `.library/packages/*` producers. Build validates the checkout again, then builds real primitives → icons → themes → charts distributions before the site. There are no library source aliases, React bridge, Solid 1 runtime or second library-root dependency installation. The web lock retains the accepted producer dependency resolutions and the exact Solid 2.0.0-rc.15 overrides (`solid-js`, `@solidjs/web`, `@solidjs/signals`, `@solidjs/compiler`, `@solidjs/babel-plugin`) with `@solidjs/vite-plugin` 3.0.0-next.50. The global 24-hour `minimumReleaseAge` stays; only those exact versions are excepted until they age.

### Explicit local sibling prepopulation

If the pinned source has not been published yet, a real local sibling clone is an explicit alternative:

```sh
git clone --no-hardlinks ../radix2solid .library
git -C .library checkout --detach e1ecdf69bc24ec24035d7b1977c3931430294cc4
node scripts/prepare-library.ts
pnpm install --frozen-lockfile
pnpm check
```

This assumes `../radix2solid` is the actual source repository containing that commit. It is **local-source validation, not proof of a remote-only GitHub checkout**. Bootstrap itself is unchanged and has no transport flags.

To update the library, review an actual clean library commit, update `library-source.json` with its full SHA, check the owned `.library` checkout is clean, and explicitly fetch/check out the new commit detached. Bootstrap deliberately rejects the old checkout after a pin change; it never silently recovers it. Retain the accepted root lock resolutions when updating workspace importers, then repeat the real producer/site checks.

## Verification scope

`pnpm check` builds real producers, typechecks the site, checks exact HTML/Markdown/document/demo/archive inventories, compiles native documented fences and installation commands, exercises copied guides, independently installs/builds **all 95 actual exported archives**, and runs bootstrap safety, existing worker/script tests and website browser cases in Chromium, Firefox and WebKit. Archive first installs have no pre-existing lock; each normal isolated install creates its own. Package names, declared native/runtime/tool pins and real tarballs remain exact. Archive installation/build coverage is not a claim that every archive received runtime interaction tests.

Runtime interactions reuse representative built archives—`dialog-css`, `toast-css-modules`, `select-tailwind` and a Charts archive—in all three engines. This is deliberately separate from the 95-archive installation/build count.

Preview binds only to `127.0.0.1`, on port 4149 unless `WEBSITE_PREVIEW_PORT` overrides it for the preview server, Playwright and the website spec together. Playwright owns its preview process; stop a manually started preview on the same port before browser checks. The library gallery is not part of this repository or its browser server configuration. Site implementation, focused commands and coverage limits are documented in [apps/website/README.md](apps/website/README.md).

## License, assets and publication limits

Native fork changes: MIT, Copyright (c) 2026 Radix2Solid contributors; see [LICENSE](LICENSE). Original website software keeps its full WorkOS MIT text in [WEBSITE-LICENSE.txt](apps/website/public/WEBSITE-LICENSE.txt). Package tarballs preserve the library's complete original and contributor notices, including reused released Colors CSS. The Charts tarball keeps the solid-recharts and Recharts MIT notices in `LICENSE` and the verbatim ISC licenses of its resolved D3 dependencies in `NOTICE`, and `check:export` verifies them in the packed archive. `NOTICE.txt` reproduces, verbatim, the license of each package whose code the site's JavaScript bundles: the four Radix2Solid packages, D3, Solid, Floating UI and the rest. `check:export` verifies it against the client build's runtime graph. Font copyright/OFL texts and provenance hashes are in `apps/website/public/fonts/`.

[NOTICE.txt](apps/website/public/NOTICE.txt) discloses historical trademarks, portraits, endorsements and externally hosted images. Software licensing does not grant trademark/likeness/deployment rights. The site is indexable. The `radix2solid.com` hostname and a `www` redirect to it are configured in Cloudflare, not in this repository; this repository does not claim the site is published. GitHub Actions deploys the `out/` that `pnpm check` validated to a Cloudflare Worker, only for pushes to `main` that are still the branch head, so publication waits for a green `pnpm check`. No analytics, npm publication or GitHub Release upload is configured or claimed. Generated exports, downloads, dependencies, the ignored library checkout and private build artifacts are not committed.
