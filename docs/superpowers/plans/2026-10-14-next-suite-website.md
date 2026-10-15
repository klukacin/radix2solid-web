# Next Suite Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Main owns technical review and dispatch; no additional human plan-approval pause. Website workers do not dispatch nested agents. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver and deploy complete, runnable documentation for Combobox, Command, Tree, Splitter, the two optional extra icons, and the selected Charts adaptations, without claiming new features exist in published rc.2.

**Architecture:** Extend the existing MDX routes, native demo folders, Themes recipes/playground, icon catalogue, source-pinned workspace producers and static export checks. Behavior stays in the real native packages; website examples supply styling, controlled-state demonstrations and observable outputs. Existing CI builds and checks the exact export before deploying it from main.

**Tech Stack:** Solid 2.0.0-rc.15 runtime/compiler graph; @solidjs/vite-plugin 3.0.0-next.50; TypeScript 7.0.2 producer tooling with native TS5.9 consumer compatibility; Vite 8.3.3, pnpm 11.5.0, Node 24.21.0, existing MDX/Playwright/Cloudflare Worker tooling.

**Spec:** Native repository `docs/superpowers/specs/2026-10-14-next-suite-design.md` plus its five linked files: `2026-10-14-next-suite-combobox-command-design.md`, `2026-10-14-next-suite-tree-design.md`, `2026-10-14-next-suite-splitter-design.md`, `2026-10-14-next-suite-icons-extra-design.md`, `2026-10-14-next-suite-charts-upstream-design.md`. Read all six before execution. The native master implementation plan supplies reviewed package commit/version and implementation evidence; this plan owns only the website/release integration.

## Global Constraints

- Feature isolation starts at website `f780d5a99e20b95776825d2caddd9cd0b5636cc9` on `implement/next-suite`, retaining pending PR #2 work. Do not overwrite its branch, original repositories, or running services.
- The four published `0.1.0-rc.2` releases are immutable. New suite manifests require a reviewed unused candidate version, never rc.2. Native release owner chooses and records that version; website reads actual manifests rather than inventing one.
- `solid-js`, `@solidjs/web`, `@solidjs/signals`, `@solidjs/compiler`, `@solidjs/babel-plugin` remain exactly `2.0.0-rc.15`; Vite plugin remains `3.0.0-next.50`. No React/Solid 1 adapter, new UI dependency or generic test/build framework.
- Callbacks propose controlled state; new Primitives render accepted state only. Combobox must never serialize a stale selected key while draft text differs. Splitter size commit reports accepted rendered resize only, never collapse.
- Command is action-only and caller-filtered; Tree focus/selection/activation/expansion are distinct; Splitter has exactly two panels. No multi-select, virtualization, router, persistence, global shortcut service, loader or action engine.
- Extra icons are optional presentation, not a Primitives dependency. Exactly FolderIcon and FolderOpenIcon are separate from the 332 existing icons; no new brand artwork or projected bundle-size claim.
- Charts only claims selected A1–A13 and parser guards B1/B2 after native evidence. Preserve original import provenance, SSR limits and all existing local patches; no full 3.10.1 parity/theming/canary claim. Controlled Brush intentionally retains imported upstream semantics, unlike new Primitives.
- No npm publish/tag/token/publisher mutations. DevOps controls publication and icons-extra first-publication rights/Trusted Publisher. Website deployment does not require npm publication.
- The designated WEBSITE integration worker executes serialized builds/tests/formatters and Git operations under Main's dispatch, and owns shared website files. Component edit workers skip gates/formatters/Git while editing. Main directs technical review and consumes actual evidence; this does not prohibit the integration worker from running the later gates. Commit only green phases explicitly staged by owned files.

## Review Focus

1. Rejected or asynchronously accepted Combobox selection while a draft differs must not submit stale data: Task 2 asserts actual FormData and validity, including reset/external form ownership.
2. Dialog Command cancellation/second-modal actions must not double-execute or steal focus: Task 3 asserts action counts and actual activeElement.
3. Tree collapse/removal with focus outside the tree must repair future tab order without stealing focus: Task 4 asserts visible preorder and real focus.
4. Splitter zero/infeasible layout and refused collapse must not report speculative commits or hide focus: Task 5 inspects rectangles, callback outputs and focus.
5. Unpublished candidate package instructions must still install the feature actually shown, including transitive Primitives and extra icon licence closure: Tasks 1/6/9 execute copied archive commands and inspect installed manifests, not just rendered text.

## Surface and integration ownership

Existing files below are relative to the website root. MDX automatically creates routes via `src/routes.ts`; do not add a second route registry. New pages are native-only, never added to upstreamRoutes. Omit the upstream-Radix `name` metadata from native-only API pages: `DocumentReferences` currently turns that field into a React source URL. Use explicit demo imports instead of fictional upstream metadata.

- Shared source/package integration: `library-source.json`, `README.md`, `package.json`, `pnpm-lock.yaml`, `apps/website/package.json`, `apps/website/README.md`, `apps/website/CHANGELOG.md`.
- Shared navigation/export/demo inventory: `apps/website/src/components/navigation.tsx`, `apps/website/coverage-manifest.json`, `apps/website/src/pages/playground.tsx`, `apps/website/src/pages/playground.module.css`; `apps/website/src/routes.ts` only needs Icons metadata clarification, not explicit new MDX routes.
- Existing package pipeline: `apps/website/scripts/build-sandboxes.ts`, `check-sandboxes.ts`, `check-export.ts`, `check-snippets.ts`; `apps/website/public/NOTICE.txt` carries verbatim actual bundled licence sections. Preserve bootstrap policy and runtime-graph checks.
- Each family creates one native page under `apps/website/data/primitives/docs/components/` and one recipe under `apps/website/data/themes/docs/recipes/`. Tasks 2–5 enumerate all demo files.
- Extra icon catalogue: `apps/website/src/components/icons/all-icons.tsx`, `search-results.tsx`, `icons-panel.tsx`; existing hero and search-bar copy change only if they incorrectly describe the added set as part of 332.
- Charts: `apps/website/src/pages/charts.tsx`, `src/components/chart-previews.tsx`, `src/demos/charts/index.tsx`, `styles.module.css`, `css/index.tsx`, `css/styles.css`, `tailwind/index.tsx`, `tailwind/styles.css`; existing Tailwind config only if new demo styling requires it. Docs: `data/charts/docs/components/{line-chart,bar-chart,sankey}.mdx`, `data/charts/docs/guides/{responsive-and-ssr,migrating-from-recharts}.mdx`, `data/charts/docs/overview/{introduction,releases,getting-started}.mdx`.
- Candidate installation surfaces: `data/primitives/docs/overview/{getting-started,introduction,releases}.mdx`, `data/themes/docs/overview/{getting-started,releases}.mdx`, Charts overview above, `src/components/icons/{icons-hero,icons-panel}.tsx`, root README. Move live candidate commands to actual archive names; identify rc.2 as the previously published release candidate rc.2 and keep it out of new-feature setup.
- Behavioral integration tests extend `e2e/website.spec.ts`. Existing bootstrap/worker tests and screenshot conventions remain; no separate framework.

## Execution sequence

After Main freezes the plan/API contracts and dispatches, Tasks 2–7 may author documentation/examples against those approved contracts without waiting for final public native N. This is draft authoring, not evidence of working code. Compilation/runtime proof requires real actual implementations from reviewed local committed source or public source; never mocks or invented exports. Task 1 supplies that build/pin dependency when available; final deployment requires a public reviewed merged SHA. Shared navigation/playground/inventory/test edits have one WEBSITE integration owner in Task 8. Task 9 verifies the union; Task 10 releases through existing CI. Parent may assign file-disjoint edit units, never multiple writers for shared files.

For each new UI RED step, the WEBSITE integration worker can run the named browser assertion against an existing built site before adding new imports/fixtures: fail on the absent route/control/behavior, not an import-broken build. Preserve that observed result. After implementation is available, compile and run the complete real interaction assertions; a build failure alone is never behavioral RED evidence and a successful build alone is never behavioral GREEN evidence.

### Task 1: Actual candidate source and honest installation contract

**Files:** `library-source.json`, `README.md`, root/site `package.json`, `pnpm-lock.yaml`; installation surfaces listed above; pipeline owners reserved for Task 6.

**Interfaces:** Consumes actual native implementation commit `N`, five actual manifests with suite version `C != 0.1.0-rc.2`, and native root/subpath declarations. Produces the workspace build input used by all subsequent tasks. `N` must be publicly fetchable for final CI; an explicit local source is allowed only for clearly labelled development proof before native integration.

- [ ] Record native review acceptance and exact N/C in private ledger. Confirm actual files export the four primitives, two extra icons and selected Charts APIs; do not fill missing exports with website mocks.
- [ ] Add failing installation/download assertions in the existing browser/export coverage: candidate package links must resolve to generated files and copied commands must install version C, not rc.2. The old site is expected to lack candidate archives and routes.
- [ ] Update source pin and README exact checkout command; explicitly fetch/checkout only this clone's `.library` at N using the existing bootstrap policy. Preserve provenance and original checkouts.
- [ ] Add icons-extra `workspace:*` to root and site dependencies and its producer build after icons/before website. Workspace glob already includes it. Refresh the lock for this actual added importer while retaining existing tool/runtime resolutions; frozen install must then work.
- [ ] Before DevOps publishes C, use actual downloaded `./wsagency-radix2solid-<package>-<C>.tgz` commands as primary candidate instructions. Themes must resolve transitive Primitives to the same local tarball using existing documented override pattern. Icons-extra is separate and optional; no requirement to install Themes to use it. Keep RC15 setup link.
- [ ] All four npm/yarn/pnpm/bun tabs must agree with actual candidate archive availability. Do not advertise `@next` or `@package@C` as installable from registry before publication. Keep exact `-E` for any registry commands that remain for the previously published release candidate rc.2; clearly say new suite features require candidate archives.
- [ ] Build actual producers/site once after package integration, run typecheck/snippet/export checks against candidate metadata. Development checks may use actual committed local native source via the explicit bootstrap override, labelled as local proof. Final CI/deployment requires public Git reachability; npm publication is not a dependency of either source build.
- [ ] Commit green input/candidate installation integration without tagging/publishing npm.

### Task 2: Combobox API and styled chooser

**Create files:** `apps/website/data/primitives/docs/components/combobox.mdx`, `apps/website/data/themes/docs/recipes/combobox.mdx`; `apps/website/src/demos/combobox/index.tsx`, `styles.module.css`, `css/index.tsx`, `css/styles.css`, `tailwind/index.tsx`, `tailwind/styles.css`, `tailwind/tailwind.config.cjs`.

**Interfaces:** Real `Combobox.Root` items/value/query/open form contract; namespace and `/combobox` imports from N. Demo default export `ComboboxDemo`. Recipe uses existing live MDX and Themes controls; no local filtering/navigation engine beyond application data/filter props.

- [ ] Add failing `next suite Combobox submits accepted keys, not drafts` browser case: actual submit/requestSubmit, FormData, unresolved empty/nonempty draft, required input focus, external form, prevented reset, parent refusal and selected-data removal.
- [ ] Author native API page with all parts and exact defaults from spec, data-defined labels, active suggestion versus committed value, native name/form ownership, disabled/readOnly caveat, controlled reconciliation, filtering, IME/editing, SSR portal/validation boundaries and exclusions. Link API namespace/subpath, real source and styled recipe without fictional upstream source link.
- [ ] Implement three existing styling variants of a real form demo with named input/trigger/clear, selected-key/query/submitted-value outputs, disabled option and no-match status. Keep all behavioral work in Combobox; provide visible acceptance/refusal control in styled recipe.
- [ ] Add focused keyboard assertions: input retains DOM focus, active-descendant points to a live option after filtering, Enter commits once without submitting, Escape requests accepted label, composition Enter does not commit. Native implementation owns broad permutations; website test verifies its actual composition.
- [ ] At integration, build/typecheck/snippets and run named browser case; require pass before family commit.

### Task 3: Command API, inline actions and Dialog recipe

**Create files:** `apps/website/data/primitives/docs/components/command.mdx`, `apps/website/data/themes/docs/recipes/command.mdx`; `apps/website/src/demos/command/index.tsx`, `styles.module.css`, `css/index.tsx`, `css/styles.css`, `tailwind/index.tsx`, `tailwind/styles.css`, `tailwind/tailwind.config.cjs`.

**Interfaces:** Real Command namespace/subpath and caller-owned search filtering; default export `CommandDemo`. Dialog uses existing native target-factory composition and actual title/description/focus hooks.

- [ ] Add failing `next suite Command dispatches once and preserves dialog focus` case with inline and Dialog actions, cancelled action, no-result Enter and all-disabled results.
- [ ] Document every part, loop default true, no value/form/open state, caller filtering, named List/Input, exactly-once cancellable onSelect and IME/editing preservation. Explicitly distinguish disabled results from Empty and no built-in global shortcut.
- [ ] Implement matching variants and styled Dialog recipe with query and action-count outputs; handler guard runs before side effects, cancellation prevents recipe close/completion, controlled refusal to close does not suppress an accepted action. Reset search/focus input explicitly on open.
- [ ] Exercise Escape return focus and an action opening another Dialog without restoration stealing focus; assert one action per gesture and no surrounding form submission.
- [ ] At integration run compiler/snippet and named browser coverage; commit green family slice.

### Task 4: Tree API and hierarchy explorer

**Create files:** `apps/website/data/primitives/docs/components/tree.mdx`, `apps/website/data/themes/docs/recipes/tree.mdx`; `apps/website/src/demos/tree/index.tsx`, `styles.module.css`, `css/index.tsx`, `css/styles.css`, `tailwind/index.tsx`, `tailwind/styles.css`, `tailwind/tailwind.config.cjs`.

**Interfaces:** Tree namespace/subpath, stable keyed Items and explicit ItemGroup hierarchy; default export `TreeDemo`. Optional extra glyph use is presentation only and must not make the primitive depend on icons-extra.

- [ ] Add failing `next suite Tree keeps focus selection and activation separate` case: arrows only move focus, Space selects, Enter activates once, ExpandTrigger only expands, cancellation/refusal leave accepted state.
- [ ] Document all parts/defaults, hasChildren versus mounted children, single/none mode, disabled-node/enabled-descendant policy, partial-data ARIA author responsibility, retained hidden selection, focus repair, no form/reset/loader/router and disclosure-list alternative.
- [ ] Implement variants and styled explorer with distinct focus/selection styling and readable selected/expanded/activation outputs. Include duplicate labels with unique keys, a disabled expanded parent, and expansion refusal control; no actual filesystem/browser domain actions.
- [ ] Test LTR/RTL branch movement, visible preorder after reorder, collapse of focused descendant, external focus not stolen, selected hidden item retained, and no dangling tabbable hidden nodes. Assert real activeElement.
- [ ] At integration run compiler/snippet and named browser checks; commit green family slice.

### Task 5: Splitter API and measured layout playground

**Create files:** `apps/website/data/primitives/docs/components/splitter.mdx`, `apps/website/data/themes/docs/recipes/splitter.mdx`; `apps/website/src/demos/splitter/index.tsx`, `styles.module.css`, `css/index.tsx`, `css/styles.css`, `tailwind/index.tsx`, `tailwind/styles.css`, `tailwind/tailwind.config.cjs`.

**Interfaces:** Splitter.Root/Panel/Handle, exactly primary–handle–secondary; default export `SplitterDemo`. Root callback outputs distinguish constrained proposal, accepted size and accepted resize commit; collapse output is separate.

- [ ] Add failing `next suite Splitter reports accepted geometry and restores focus` case with px/% examples, both-panel constraints, nested root and named separator.
- [ ] Document all props/defaults, percent available space excluding track/gaps, px explicit initial size, perpendicular aria-orientation, infeasible underflow/overflow, zero geometry, accepted-only commit, drag cancellation, physical RTL arrows and deterministic SSR then measurement.
- [ ] Implement variants and styled playground with px/% examples, nested roots, controlled accept/refuse toggle, collapse/restore, and live proposal/accepted/commit outputs. Reserve collapsed track and inert descendants via primitive; usable handle hit area, focus and forced-colors CSS.
- [ ] Test actual panel rectangles after drag/key, refusal, RTL, resize and collapse; no commit for refused resize/collapse/measurement, focus moves to handle only when accepted collapse hides focused content. Zero/infeasible handles cannot resize/toggle and all exposed values remain finite.
- [ ] At integration run compiler/snippet and named browser checks; commit green family slice.

### Task 6: Two extra icons and complete artifact chain

**Modify:** icons catalogue/search/panel, root/site package integration from Task 1, `apps/website/src/routes.ts` Icons description; `apps/website/scripts/{build-sandboxes,check-sandboxes,check-export,check-snippets}.ts`, `apps/website/public/NOTICE.txt`, coverage manifest through integration owner. Update hero/search-bar wording only when necessary to keep existing 332 and new two separate.

**Interfaces:** `@wsagency/radix2solid-icons-extra` root/deep SVG exports from N/C, FolderIcon/FolderOpenIcon only, actual manifest/LICENSE/artwork provenance. No new icon registry abstraction.

- [ ] Add failing `next suite Extra icons remain separate and downloadable` test: Extra group has exactly two named controls, original group still 332; search returns an explicitly Extra-labelled folder result; copying produces standalone SVG; downloadable asset uses viewBox 0 0 24 24; default component size15 and titled rendering retained.
- [ ] Render Extra as its own catalogue section and separate search-result group, reuse existing copy toast/buttons. Preserve original labels/search behavior and existing rc.1/RC13 historical bundle measurement, not a claim for new icons.
- [ ] Add installation and root/deep usage example, actual candidate archive link, optional nature and factual original-artwork provenance/link. No npm availability/size claim before evidence.
- [ ] Add fifth package to actual packed/download/snippet inventories. Keep Charts lookup correct when extending the four-item list (currently chartsTarball uses packageFiles[3]); append extras or select by known package name, never silently inspect wrong tarball.
- [ ] Copy extra LICENSE into relevant generated examples and reproduce actual bundled extra-package licence text in NOTICE. Preserve original and D3 notices; no legal assurance beyond source/provenance. Add fifth archive to public output and assertions.
- [ ] Add a runnable extra-icons demo sandbox using existing generator conventions (create `src/demos/icons-extra/index.tsx`, `styles.module.css`, `css/index.tsx`, `css/styles.css`, `tailwind/index.tsx`, `tailwind/styles.css`, `tailwind/tailwind.config.cjs`); show its download from the extra installation section. It imports actual icons-extra, not original-icons replacements. Add vendor dependency only where used; existing Primitives consumers need not gain optional extra icons.
- [ ] Extract and install actual new archives, assert imported extra manifest C, standalone SVG exports and complete licence files; build and exercise one extra icon. Native suite owns full distribution/tree-shaking contract, website owns exported files actually downloaded here.
- [ ] Run export/snippet and focused browser coverage after integration, commit green optional package slice.

### Task 7: Selected Charts documentation and live public APIs

**Modify:** Charts paths in the surface list, no new chart runtime wrapper/framework.

**Interfaces:** Legend position/offset/auto layout with CartesianPosition type; XAxis height number or auto; Sankey title/desc/accessibilityLayer. Native owner supplies selected-row ledger/status and tests. No website reimplementation of measurement or layout.

- [ ] Add failing `next suite Charts displays selected legend axis and Sankey APIs` case: actual Legend inside/outside placement selector, rotated-label auto XAxis, Sankey accessible title/description.
- [ ] Extend existing chart-previews and three Charts demo styling variants with these real props and readable configuration. Keep existing chart families and single-SVG hydration intact. Display controls in Charts playground section; no hidden-only examples.
- [ ] Update line/bar documentation with Legend position precedence, auto layout defaults and outside SSR zero-size measurement caveat; describe auto XAxis's first-render30px fallback, post-hydration measurement and non-server-final status including string label. Update Sankey prop docs and live demo names/descriptions/accessibility.
- [ ] Update landing/release/introduction/migration/SSR copy from actual native ledger: selected A1–A13 and B1/B2 only, deferred CartesianGrid theme and no full parity. Describe Brush's retained dragged slide despite unchanged controlled index props, distinct from new Primitives controlled refusal.
- [ ] Assert client measurement changes expected geometry, inside legend placement remains stable, Sankey names/description survive hydration and old numeric-axis/basic-chart behavior still works; keep native detailed per-row regressions authoritative rather than duplicating whole native suite.
- [ ] Run export/snippets and focused chart browser case plus earlier Charts hydration case; commit green chart documentation slice.

### Task 8: Shared navigation, playground and exact coverage integration

**Modify:** `navigation.tsx`, `playground.tsx`, `playground.module.css`, `coverage-manifest.json`, root/site README and CHANGELOG, `e2e/website.spec.ts`. New MDX uses existing routes loader unchanged.

**Interfaces:** Family demo default exports and actual docs from Tasks2–5; Charts preview exports from Task7; two extra icons/artifacts from Task6. One owner integrates these shared files.

- [ ] Add four native API routes and four recipe routes to curated navigation/nativeRoutes and exact document/route lists, not upstreamRoutes. Add demo files and generated archive names to inventories. Four family demos with CSS/Modules/Tailwind yield twelve new archives; extra-icons variants yield three. Baseline95 becomes110 only if these exact exports exist; derive/verify actual counts, never merely adjust assertions to pass.
- [ ] Put four styled interactive sections into Themes playground with names/anchors and source-viewer links; reuse family components where appropriate, no second state engine. Carry Themes token/light/dark/forced-colors styles. Recipes and API pages link both directions; expose downloads through existing source-viewer conventions.
- [ ] Integrate all named behavioral tests into existing website spec. Check native source/edit links and absence of fictional upstream React links on the four new pages; check MD/HTML/search, all eight routes, playground anchors and download reachability.
- [ ] Update docs/changelog counts from actual generated inventories. Expected new document count168/routes183+404 if only the eight new pages are added; preserve historical original137 MDX/151 routes and describe new material as native-only.
- [ ] Commit only after combined checks in Task9 pass; do not claim native source or registry publication based on website compilation.

### Task 9: Integrated website and copied-consumer proof

**Files:** existing checker/test files above; private logs/screenshot evidence excluded from Git. No generic runner creation.

- [ ] Run `pnpm build` against reviewed N, `pnpm typecheck`, `pnpm --filter @radix-solid/website check:snippets`, `pnpm --filter @radix-solid/website check:export`. Require genuine manifests, exact native command metadata, all HTML/Markdown twins, package/licence closure and all new references; record actual counts.
- [ ] Run focused Chromium `pnpm exec playwright test e2e/website.spec.ts --project=chromium --grep 'next suite|charts landing hydrates|published package installation'` on an owned free loopback port (not4149/4150). Adapt existing published-install case so it distinguishes the previously published release candidate rc.2 from the new candidate rather than falsely requiring registry installation of C.
- [ ] Run changed-path keyboard/focus/geometry cases in Firefox and WebKit; exercise Themes appearance/forced-colors and narrow viewport for new sections. Report actual coverage, not APG or screen-reader certification. Native node-preserving SSR tests remain separately required; website confirms its own composed server hosts survive hydration.
- [ ] In disposable consumer(s), download actual new archives, execute the real copied pnpm candidate setup with RC15 overrides and transitive local Primitives mapping, then typecheck/build and exercise all four family imports plus extra-icons and changed Charts props. Assert installed native versions C and no workspace/private path dependency leakage. Do not reinstall old unrelated95 archives locally just for this feature; generated new archives must each build, with representative actual UI checks.
- [ ] Save complete stdout/stderr directly to private files, not truncated tool-reader snapshots. Stop owned preview processes; remove temporary consumer/probes. Keep public docs limited to evidence actually obtained.
- [ ] Main directs technical review and consumes evidence; the designated WEBSITE integration worker resolves assigned findings, executes serialized gates and commits focused green slices under Main. No user confirmation pause; actual native implementations are required for passing build/runtime claims, and public reviewed source is required at final deployment.

### Task 10: Source publication, website PR integration and deployment

**Files:** final `library-source.json`/README source SHA, candidate install copy if DevOps publication state changes, private deployment receipt. No npm workflow or credential mutation by website worker.

- [ ] Native owner publishes/merges reviewed implementation code through authorized Git workflow. Set final website pin to actual public merged native commit; bootstrap/frozen install/build proof must use remote reachability, not only local override. If N changed on merge, verify real diff before updating; no blind repin/rebase.
- [ ] Main explicitly sequences existing green website PR#2 integration before next-suite integration. Its merge can trigger deployment of the old candidate; do not race that deployment or silently replace its branch. Reconcile new feature ancestry with actual main and disclose stacked work correctly in PR body.
- [ ] Push only reviewed feature branch non-force and open/update PR against main, with truthful feature, source-pin, candidate archive and verification scope. Observe remote SHA and actual CI run links. CI runs existing full `pnpm check` (including full sandbox consumer validation); do not bypass it because targeted local checks passed.
- [ ] Once current PR CI is green and technical review accepts, merge through existing GitHub process. Observe the resulting main SHA and its main-push check/deploy run. Its remote-main freshness check must not have skipped deployment; successful check alone is insufficient proof of deployment.
- [ ] Confirm deployment job/log receipt and live HTTP HTML/Markdown/assets/new routes. Perform one bounded live browser smoke through new documentation, extra icons and Charts examples; verify displayed candidate archive links and downloads. Never expose credentials in receipts.
- [ ] If DevOps has not published C, deploy honest candidate/archive instructions; do not wait on npm unnecessarily. Switch to primary registry `-E` commands only in a separately verified change after actual DevOps publication, with first icons-extra publisher setup handled by maintainers. No npm settings/tokens/tags/publish action here.
- [ ] Save private complete release receipt: native/web SHAs, branch/PR URL, check/deploy run URLs/status, live URL/time, observed smoke result and installation status. Preserve feature isolation for feedback. Stop only when requested website deployment is actually observed or a concrete external prerequisite blocks it.

## Self-review

Coverage mapped: suite cross-family controlled-state/SSR/accessibility constraints → Tasks2–5/9; all four native API pages and styled recipe/playgrounds → Tasks2–5/8; icons catalogue/install/provenance/artifact chain → Task6; all three new Charts public APIs plus selected/deferred status and Brush exception → Task7; truthful candidate/version/source pin and npm boundary → Tasks1/10; route/search/Markdown/demo/download inventories → Tasks8/9; deployment evidence → Task10. All five Review Focus items have named behavioral checks. No tests assert source prose or permanently pin demonstration strings; assertions target public state, rendered semantics and real package metadata. Existing bootstrap and CI frameworks are reused. Native implementation and maintainer npm setup are separate ownership, not unfinished website behavior relabelled as complete.
