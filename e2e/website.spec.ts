import { readFileSync } from 'node:fs';
import { expect, test as base, type Locator } from '@playwright/test';
import { accessibilityViolations } from './accessibility.js';

// Test-only exact original free-license images; production URLs, Unsplash+ and WorkOS remain live.
// Unlisted images.unsplash.com requests fail instead of silently falling back to the network.
const unsplashDirectory = new URL('./fixtures/unsplash/', import.meta.url);
const { items } = JSON.parse(readFileSync(new URL('manifest.json', unsplashDirectory), 'utf8')) as { items: { url: string; file: string; type: string }[] };
const unsplashFixtures: Record<string, { url: string; file: string; type: string }> = Object.fromEntries(items.map(item => [item.url, item]));
const test = base.extend<{ unsplash: void }>({
  unsplash: [async ({ page }, use) => {
    const missing: string[] = [];
    await page.route('https://images.unsplash.com/**', route => {
      const fixture = unsplashFixtures[route.request().url()];
      if (!fixture) { missing.push(route.request().url()); return route.abort('failed'); }
      return route.fulfill({ contentType: fixture.type, body: readFileSync(new URL(fixture.file, unsplashDirectory)) });
    });
    await use();
    expect(missing, 'Unsplash image requests without an exact licensed fixture').toEqual([]);
  }, { auto: true }],
});

const origin = `http://127.0.0.1:${process.env.WEBSITE_PREVIEW_PORT ?? 4149}`;

test('published package installation commands retain exact versions and local archives', async ({ page, context, browserName, request }) => {
  test.skip(browserName !== 'chromium', 'Native clipboard read permission is supported by Chromium.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  for (const [name, path, manager] of [
    ['primitives', '/primitives/docs/overview/getting-started', 'npm install'],
    ['themes', '/themes/docs/overview/getting-started', 'pnpm add'],
    ['icons', '/icons', 'pnpm add'],
    ['charts', '/charts/docs/overview/getting-started', 'pnpm add'],
  ]) {
    const manifest = JSON.parse(readFileSync(new URL(`../.library/packages/${name}/package.json`, import.meta.url), 'utf8'));
    const command = `${manager} -E ${manifest.name}@${manifest.version}`;
    await page.goto(`${origin}${path}`);
    if (name === 'themes') await page.getByRole('tab', { name: 'pnpm', exact: true }).click();
    const code = page.locator('pre').filter({ hasText: command }).filter({ visible: true }).first();
    await expect(code).toHaveText(command);
    const block = page.locator('[data-code-block-content]').filter({ has: code });
    await block.hover();
    await block.getByRole('button', { name: 'Copy code to clipboard', exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(command);
    if (name === 'themes') {
      for (const [tab, verb] of [['npm', 'install'], ['yarn', 'add'], ['bun', 'add']]) {
        await page.getByRole('tab', { name: tab, exact: true }).click();
        const panel = page.getByRole('tabpanel').filter({ visible: true });
        const expected = `${tab} ${verb} -E ${manifest.name}@${manifest.version}`;
        await expect(panel.locator('pre')).toHaveText(expected);
        await panel.getByRole('button', { name: 'Copy code to clipboard', exact: true }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
      }
    }
    await expect(page.locator(`a[href="https://www.npmjs.com/package/${manifest.name}"]`).first()).toBeVisible();
    await expect(page.locator(`a[href="/packages/wsagency-radix2solid-${name}-${manifest.version}.tgz"]`).first()).toBeVisible();
    if (name === 'icons') {
      const input = page.getByRole('textbox', { name: 'Install native icons from npm', exact: true });
      await expect(input).toHaveValue(command);
      await input.click();
      expect(await input.evaluate(node => (node as HTMLInputElement).selectionEnd! - (node as HTMLInputElement).selectionStart!)).toBe(command.length);
    }
    const markdown = await (await request.get(`${origin}${path}.md`)).text();
    // Markdown exports the server-selected npm tab, not the hydrated pnpm tab.
    expect(markdown).toContain(name === 'themes' ? `npm install -E ${manifest.name}@${manifest.version}` : command);
    expect(markdown).toContain(`https://www.npmjs.com/package/${manifest.name}`);
    expect(markdown).toContain(`/packages/wsagency-radix2solid-${name}-${manifest.version}.tgz`);
    expect(markdown).not.toContain('not published on npm');
  }
});

for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) {
  test(`primary GitHub control links to the native library at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/primitives', '/icons', '/colors', '/themes/playground', '/primitives/docs/components/dialog', '/themes/docs/components/dialog', '/colors/docs/palette-composition/scales', '/blog/themes-3', '/primitives/case-studies/vercel']) {
      await page.goto(`${origin}${path}`);
      const github = page.getByRole('link', { name: 'View GitHub', exact: true }).filter({ visible: true });
      await expect(github).toHaveCount(1);
      await expect(github).toHaveAttribute('href', 'https://github.com/wsagency/radix2solid');
      for (const control of [github, page.getByRole('link', { name: 'Radix2Solid homepage', exact: true }).first(), page.getByRole('button', { name: 'Toggle theme', exact: true }).filter({ visible: true }).first()]) {
        const bounds = await control.boundingBox();
        expect(bounds, `${path}: primary control has bounds`).not.toBeNull();
        expect(bounds!.x, `${path}: primary control is inside the initial viewport`).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width, `${path}: primary control is inside the initial viewport`).toBeLessThanOrEqual(viewport.width);
      }
    }
  });

  test(`document references link to own source, editing and native issues at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${origin}/primitives/docs/components/dialog`);
    const references = page.getByRole('navigation', { name: 'Document references', exact: true });
    const file = 'apps/website/data/primitives/docs/components/dialog.mdx';
    await expect(references.getByRole('link', { name: 'View documentation source', exact: true })).toHaveAttribute('href', `https://github.com/wsagency/radix2solid-web/blob/main/${file}`);
    await expect(references.getByRole('link', { name: 'Edit documentation', exact: true })).toHaveAttribute('href', `https://github.com/wsagency/radix2solid-web/edit/main/${file}`);
    await expect(references.getByRole('link', { name: 'Report native issue', exact: true })).toHaveAttribute('href', 'https://github.com/wsagency/radix2solid/issues/new');
  });
}

test('rendered document and not-found metadata identify the native fork without an invented origin', async ({ page }) => {
  for (const [path, title] of [['/primitives/docs/components/dialog', 'Dialog – Radix2Solid'], ['/404', 'Page not found – Radix2Solid']]) {
    await page.goto(`${origin}${path}`);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Radix2Solid');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', '/social/radix2solid.png');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', '/social/radix2solid.png');
    const image = await page.request.get(`${origin}/social/radix2solid.png`);
    expect(image.ok()).toBe(true);
    expect(image.headers()['content-type']).toContain('image/png');
  }
});

test('static Dialog documentation hydrates its custom trigger without replacing the server host', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  const document = await request.get(`${origin}/primitives/docs/components/dialog`);
  expect(document.status()).toBe(200);
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/assets\/.*\.js(?:\?.*)?$/, async route => { await ready; await route.continue(); });
  await page.goto(`${origin}/primitives/docs/components/dialog`, { waitUntil: 'commit' });
  const trigger = page.getByRole('button', { name: 'Edit profile', exact: true });
  await expect(trigger).toBeVisible();
  await trigger.evaluate(node => Reflect.set(window, '__websiteServerTrigger', node));
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const styling = page.getByLabel('Styling solution', { exact: true });
  await expect(styling).toBeDisabled();
  await expect(page.getByLabel('Source file', { exact: true })).toBeDisabled();
  release();
  await page.waitForLoadState('load');
  expect(await trigger.evaluate(node => node === Reflect.get(window, '__websiteServerTrigger'))).toBe(true);
  await styling.selectOption('css');
  await expect(page.getByRole('link', { name: 'Download runnable sandbox', exact: true })).toHaveAttribute('href', '/sandboxes/dialog-css.tar.gz');
  await expect(page.getByRole('rowheader').filter({ has: page.getByText('defaultOpen', { exact: true }) })).toBeVisible();
  await page.getByRole('heading', { level: 2, name: 'API Reference', exact: true }).getByRole('link', { name: 'API Reference', exact: true }).click();
  await expect(page).toHaveURL(/#api-reference$/);
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('Pedro Duarte');
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Native document consumer');
  await dialog.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('documentation Markdown negotiation retains native snippets and page semantics', async ({ request }) => {
  const response = await request.get(`${origin}/primitives/docs/components/dialog`, { headers: { Accept: 'text/markdown' } });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/markdown');
  expect(response.headers().vary).toContain('Accept');
  const markdown = await response.text();
  expect(markdown).toContain('# Dialog');
  expect(markdown).toContain('## API Reference');
  expect(markdown).toContain('defaultOpen');
  expect(markdown).toContain('target("button"');
  expect(markdown).not.toMatch(/React\.|react-dom|@radix-ui\/react/);
  const twin = await request.get(`${origin}/primitives/docs/components/dialog.md`);
  expect(await twin.text()).toBe(markdown);
});

test('native search retries a failed index load and keyboard-selects the real documentation heading', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/search-index.json', route => route.fulfill({ status: 503, contentType: 'application/json', body: 'Unavailable' }), { times: 1 });
  await page.goto(`${origin}/primitives/docs/components/dialog`);
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const search = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  const input = search.getByRole('combobox', { name: 'Search documentation', exact: true });
  await input.fill('asynchronous form');
  await expect(search.getByRole('alert')).toContainText('503');
  const indexLoaded = page.waitForResponse(response => response.url().endsWith('/search-index.json') && response.status() === 200);
  await search.getByRole('button', { name: 'Retry', exact: true }).click();
  await (await indexLoaded).finished();
  await expect(search.getByRole('option').first()).toContainText('Close after asynchronous form submission');
  await input.press('Enter');
  await expect(page).toHaveURL(/#close-after-asynchronous-form-submission$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('mobile documentation navigation and styling controls keep the native demo runnable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/primitives/docs/components/dialog', '/themes/docs/components/dialog', '/colors/docs/palette-composition/scales', '/blog/themes-3', '/primitives/case-studies/vercel']) {
    await page.goto(`${origin}${path}`);
    const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
    const searchTrigger = page.getByRole('button', { name: 'Search documentation', exact: true });
    for (const control of [menu, searchTrigger]) {
      await expect(control).toBeVisible();
      const bounds = await control.boundingBox();
      expect(bounds, `${path}: header control has bounds`).not.toBeNull();
      expect(bounds!.x, `${path}: header control is inside the initial viewport`).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width, `${path}: header control is inside the initial viewport`).toBeLessThanOrEqual(390);
      await control.click();
      const dialog = page.getByRole('dialog', { name: control === menu ? 'Navigation' : 'Search documentation', exact: true });
      await expect(dialog).toBeVisible();
      if (control === menu) await expect(dialog.getByRole('navigation', { name: 'Products', exact: true })).toBeVisible();
      else await expect(dialog.getByRole('combobox', { name: 'Search documentation', exact: true })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(control).toBeFocused();
    }
    expect(await page.evaluate(() => window.scrollX)).toBe(0);
  }
  await page.goto(`${origin}/primitives/docs/components/dialog`);
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  const navigation = page.getByRole('dialog', { name: 'Navigation', exact: true });
  await navigation.getByRole('link', { name: 'Dialog', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByLabel('Styling solution', { exact: true }).selectOption('css');
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download runnable sandbox', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('dialog-css.tar.gz');
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Edit profile', exact: true }).getByRole('textbox', { name: 'Name', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
});

test('trusted Themes live code renders native target composition and the real property table', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/themes/docs/components/dialog`);
  await expect(page.getByRole('rowheader').filter({ has: page.getByText('size', { exact: true }) })).toBeVisible();
  const trigger = page.getByRole('button', { name: 'Edit profile', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('Freja Johnsen');
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Native live MDX consumer');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Description of asChild', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Description of asChild', exact: true }).getByRole('link', { name: 'Composition', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('link', { name: 'Composition', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const search = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  await search.getByRole('combobox').fill('With inset content');
  await search.getByRole('option').filter({ hasText: 'With inset content', has: page.locator('a[href="/themes/docs/components/dialog#with-inset-content"]') }).click();
  await expect(page).toHaveURL(/\/themes\/docs\/components\/dialog#with-inset-content$/);
  expect(errors).toEqual([]);
});

test('color scales retain all twelve server steps through hydration and recover pre-hydration hover for native copy controls', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/assets\/.*\.js(?:\?.*)?$/, async route => { await ready; await route.continue(); });
  await page.goto(`${origin}/colors/docs/palette-composition/scales`, { waitUntil: 'commit' });
  const steps = page.locator('h4#gray + .rt-Flex .rt-Text');
  await expect(steps).toHaveText(Array.from({ length: 12 }, (_, index) => String(index + 1)));
  const alpha = page.locator('h4#gray + .rt-Flex + .rt-Flex + .rt-Flex > .rt-Flex > .rt-Box').first();
  await expect(alpha).not.toHaveCSS('background-image', 'none');
  await steps.first().evaluate(node => Reflect.set(window, '__serverScaleStep', node));
  const gray = page.locator('h4#gray + .rt-Flex + .rt-Flex');
  await gray.hover();
  release();
  await page.waitForLoadState('load');
  expect(await steps.first().evaluate(node => node === Reflect.get(window, '__serverScaleStep'))).toBe(true);
  await expect(gray.getByRole('button')).toBeVisible();
  await gray.getByRole('button').click();
  await expect(page.getByRole('menuitem', { name: 'Copy as SVG', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('stored appearance paints before hydration and native theme controls retain the system preference', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => { if (localStorage.getItem('theme') === null) localStorage.setItem('theme', 'dark'); });
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/assets\/.*\.js(?:\?.*)?$/, async route => { await ready; await route.continue(); });
  await page.goto(`${origin}/primitives/docs/components/dialog`, { waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveClass(/dark-theme/);
  release();
  await page.waitForLoadState('load');
  await page.getByRole('button', { name: 'Toggle theme', exact: true }).first().click();
  await expect(page.locator('html')).toHaveClass(/light-theme/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('system');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light-theme/);
  expect(errors).toEqual([]);
});

test('marketing examples switch through queued animations and mobile navigation restores focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1365, height: 900 });
  await page.goto(`${origin}/`);
  const hero = page.getByRole('heading', { name: /Start building.*your app now/ }).first();
  await expect(hero).toBeVisible();
  expect(await hero.evaluate(node => parseFloat(getComputedStyle(node).fontSize) - parseFloat(getComputedStyle(document.body).fontSize))).toBeGreaterThan(0);
  const first = page.getByRole('button', { name: 'Example 1', exact: true });
  await expect(first).toHaveAttribute('data-visibility', 'visible');
  await page.getByRole('button', { name: 'Example 3', exact: true }).click();
  await page.getByRole('button', { name: 'Example 5', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Example 5', exact: true })).toHaveAttribute('data-visibility', 'visible');
  await expect(first).toHaveAttribute('data-visibility', 'hidden');
  await expect(page.getByRole('link', { name: 'Get started', exact: true })).toHaveAttribute('href', '/themes/docs/overview/getting-started');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await hero.evaluate(node => parseFloat(getComputedStyle(node).fontSize) - parseFloat(getComputedStyle(document.body).fontSize))).toBeGreaterThan(0);
  const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
  await menu.click();
  const navigation = page.getByRole('dialog', { name: 'Navigation', exact: true });
  await expect(navigation.getByRole('link', { name: 'Playground', exact: true })).toHaveAttribute('href', '/themes/playground');
  await expect(navigation.getByRole('button', { name: 'Toggle theme', exact: true })).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(navigation).toHaveCount(0);
  await expect(menu).toBeFocused();
  expect(errors).toEqual([]);
});

test('footer credit stays aligned, contained and keyboard reachable on desktop and narrow screens', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  for (const width of [1365, 320, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/themes/docs/overview/getting-started']) {
      await page.goto(`${origin}${path}`);
      await page.evaluate(() => document.fonts.ready);
      const footer = page.locator('footer').last();
      const credit = footer.locator('a[href="https://ws.agency"]');
      await footer.locator('a[href="/NOTICE.txt"]').focus();
      await page.keyboard.press('Tab');
      await expect(credit).toBeFocused();
      const link = (await credit.boundingBox())!;
      expect(link.height, 'agency credit retains a usable touch target').toBeGreaterThanOrEqual(44);
      expect(await footer.evaluate(element => [...element.querySelectorAll('*')].filter(node => {
        const bounds = node.getBoundingClientRect();
        return bounds.width > 0 && (bounds.left < 0 || bounds.right > innerWidth + 1);
      }).map(node => node.tagName)), 'footer content stays inside the viewport without clipping').toEqual([]);
      const fillGap = await footer.evaluate(element => {
        const style = getComputedStyle(element);
        const available = element.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return Math.abs(available - element.firstElementChild!.getBoundingClientRect().width);
      });
      expect(fillGap, 'footer content fills the available width inside its horizontal padding').toBeLessThanOrEqual(1);
      if (width >= 768) {
        const centreDifference = await footer.evaluate(element => {
          const link = element.querySelector('a[href="https://ws.agency"]')!.getBoundingClientRect();
          const copy = element.querySelector('a[href="https://github.com/klukacin"]')!.closest('p')!.getBoundingClientRect();
          return Math.abs(link.y + link.height / 2 - copy.y - copy.height / 2);
        });
        expect(centreDifference, 'adjacent credit and creator copy share a vertical centre').toBeLessThanOrEqual(1);
      }
    }
  }
});

test('desktop homepage footer credit remains clickable after keyboard scrolling past live examples', async ({ page }, testInfo) => {
  // Failure diagnostics only: phases, page/console/asset events and the Example 2 DOM/role state go to stdout, then the original error is rethrown.
  const started = Date.now();
  let appearance: 'light' | 'dark' = 'light';
  const phases: { appearance: string; phase: string; elapsedMs: number }[] = [];
  const events: Record<string, unknown>[] = [];
  let beforeClick: unknown;
  const phase = (name: string) => phases.push({ appearance, phase: name, elapsedMs: Date.now() - started });
  page.on('pageerror', error => events.push({ event: 'pageerror', elapsedMs: Date.now() - started, message: error.message, stack: error.stack }));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') events.push({ event: 'console', elapsedMs: Date.now() - started, type: message.type(), text: message.text().slice(0, 300), location: message.location() }); });
  page.on('requestfailed', request => { if (request.url().startsWith(`${origin}/assets/`)) events.push({ event: 'asset-requestfailed', elapsedMs: Date.now() - started, url: request.url(), type: request.resourceType(), failure: request.failure() }); });
  page.on('response', response => { if (response.url().startsWith(`${origin}/assets/`) && (response.status() < 200 || response.status() >= 300)) events.push({ event: 'asset-non2xx', elapsedMs: Date.now() - started, url: response.url(), type: response.request().resourceType(), status: response.status() }); });
  try {
    await page.setViewportSize({ width: 1365, height: 900 });
    for (appearance of ['light', 'dark'] as const) {
      phase('emulate-media');
      await page.emulateMedia({ colorScheme: appearance });
      phase('navigation');
      await page.goto(`${origin}/`);
      phase('fonts-ready');
      beforeClick = await page.evaluate(async () => {
        await document.fonts.ready;
        return {
          readyState: document.readyState, documentClass: document.documentElement.className.slice(0, 120),
          roots: [...document.querySelectorAll('[data-is-firefox]')].map(root => ({ firefox: root.getAttribute('data-is-firefox'), itemStates: [...root.querySelectorAll('[class*="MagicCurtainItem"]')].map(item => item.getAttribute('data-visibility')) })),
          buttons: [...document.querySelectorAll('button')].map(button => ({ label: button.getAttribute('aria-label'), text: button.textContent?.slice(0, 40), role: button.getAttribute('role') })),
          example2: [...document.querySelectorAll('button[aria-label="Example 2"]')].map(button => {
            const ancestors = [];
            for (let node: Element | null = button; node; node = node.parentElement) { const style = getComputedStyle(node); const bounds = node.getBoundingClientRect(); ancestors.push({ tag: node.tagName, class: String(node.className).slice(0, 80), ariaHidden: node.getAttribute('aria-hidden'), inert: node.hasAttribute('inert'), display: style.display, visibility: style.visibility, opacity: style.opacity, width: bounds.width, height: bounds.height }); }
            return { html: button.outerHTML.slice(0, 400), ancestors };
          }),
        };
      });
      const first = page.getByRole('button', { name: 'Example 1', exact: true });
      const second = page.getByRole('button', { name: 'Example 2', exact: true });
      phase('example2-role-snapshot');
      const roles = { exact: await second.count(), includingHidden: await page.getByRole('button', { name: 'Example 2', exact: true, includeHidden: true }).count() };
      beforeClick = { appearance, elapsedMs: Date.now() - started, dom: beforeClick, roles };
      phase('example2-click');
      await second.click();
      phase('example-visibility');
      await expect(second).toHaveAttribute('data-visibility', 'visible');
      await expect(first).toHaveAttribute('data-visibility', 'hidden');

      const footer = page.locator('footer').last();
      const credit = footer.locator('a[href="https://ws.agency"]');
      phase('footer-keyboard-focus');
      await footer.locator('a[href="/NOTICE.txt"]').focus();
      await page.keyboard.press('Tab');
      await expect(credit).toBeFocused();
      await expect(page.getByRole('link', { name: 'Radix2Solid homepage', exact: true }).filter({ visible: true }).first()).toBeInViewport();
      phase('screenshot');
      await page.screenshot({ path: testInfo.outputPath(`hero-footer-${appearance}.png`) });
      phase('credit-hit-targets');
      await expect.poll(() => credit.locator('img').filter({ visible: true }).evaluate(image => {
        const link = image.closest('a')!;
        const nodes = [link, image, link.querySelector('span')!];
        return nodes.map(node => {
          const bounds = node.getBoundingClientRect();
          const hit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
          return node.contains(hit);
        });
      }), { message: `${appearance}: footer link, logo and text own their visible hit targets` }).toEqual([true, true, true]);
      phase('appearance-complete');
    }
  } catch (error) {
    let failureDOM: unknown;
    try {
      failureDOM = await page.evaluate(() => ({ readyState: document.readyState, roots: [...document.querySelectorAll('[data-is-firefox]')].map(root => ({ firefox: root.getAttribute('data-is-firefox'), items: root.querySelectorAll('[class*="MagicCurtainItem"]').length })), buttons: [...document.querySelectorAll('button')].map(button => ({ label: button.getAttribute('aria-label'), text: button.textContent?.slice(0, 40), ariaHiddenAncestor: button.closest('[aria-hidden="true"]')?.outerHTML.slice(0, 400), inertAncestor: button.closest('[inert]')?.outerHTML.slice(0, 400) })) }));
    } catch (snapshotError) { failureDOM = { unavailable: String(snapshotError) }; }
    console.log('[footer-diagnostic] ' + JSON.stringify({ appearance, elapsedMs: Date.now() - started, phases, events, beforeClick, failureDOM, failure: String(error) }));
    throw error;
  }
});

test('playground theme changes retain the hydrated root and native dialog interaction', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/themes/playground`);
  const root = page.locator('[data-is-root-theme="true"]');
  await root.evaluate(node => Reflect.set(window, '__playgroundRoot', node));
  await page.getByRole('radio', { name: 'Tomato', exact: true }).click();
  await expect(root).toHaveAttribute('data-accent-color', 'tomato');
  expect(await root.evaluate(node => node === Reflect.get(window, '__playgroundRoot'))).toBe(true);
  const trigger = page.getByRole('button', { name: 'Open', exact: true }).first();
  await trigger.click();
  const dialog = page.getByRole('alertdialog', { name: 'Revoke access', exact: true });
  await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('ecommerce examples keep single selection and independent multiple selections live', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/themes/example-ecommerce`);
  const tomorrow = page.getByRole('radio', { name: 'Tomorrow', exact: true });
  const later = page.getByRole('radio', { name: 'Within 3 days', exact: true });
  await tomorrow.check();
  await later.check();
  await expect(tomorrow).not.toBeChecked();
  await expect(later).toBeChecked();
  await later.click();
  await expect(later).toBeChecked();
  const small = page.getByRole('button', { name: 'XS', exact: true });
  const medium = page.getByRole('button', { name: 'M', exact: true });
  await small.click();
  await medium.click();
  await expect(small).toHaveAttribute('aria-pressed', 'true');
  await expect(medium).toHaveAttribute('aria-pressed', 'true');
  await small.click();
  await expect(small).toHaveAttribute('aria-pressed', 'false');
  await expect(medium).toHaveAttribute('aria-pressed', 'true');
  await expect(later).toBeChecked();
  const bookmarks = page.getByRole('button', { name: 'Bookmark', exact: true });
  const [sneakers, jeans] = [bookmarks.nth(0), bookmarks.nth(1)];
  await expect(sneakers).toHaveAttribute('aria-pressed', /^(true|false)$/);
  await expect(jeans).toHaveAttribute('aria-pressed', /^(true|false)$/);
  const [sneakersInitial, jeansInitial] = [await sneakers.getAttribute('aria-pressed'), await jeans.getAttribute('aria-pressed')];
  const inverse = (value: string | null) => value === 'true' ? 'false' : 'true';
  await sneakers.click();
  await expect(sneakers).toHaveAttribute('aria-pressed', inverse(sneakersInitial));
  await expect(jeans).toHaveAttribute('aria-pressed', jeansInitial!);
  await jeans.click();
  await expect(jeans).toHaveAttribute('aria-pressed', inverse(jeansInitial));
  await expect(sneakers).toHaveAttribute('aria-pressed', inverse(sneakersInitial));
  expect(errors).toEqual([]);
});

test('icon search preserves literal query syntax and word-prefix matching', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/icons`);
  const search = page.getByRole('textbox', { name: 'Search icons', exact: true });
  await search.fill('[.*');
  await expect(page.getByRole('status')).toContainText('[.*');
  await expect(page.getByRole('button', { name: 'GitHub Logo', exact: true })).toHaveCount(0);
  await search.fill('github');
  await expect(page.getByRole('button', { name: 'GitHub Logo', exact: true })).toBeVisible();
  await search.fill('clock');
  await expect(page.getByRole('button', { name: 'Clock', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Counter-Clockwise Clock', exact: true })).toBeVisible();
  await search.fill('lock');
  await expect(page.getByRole('button', { name: 'Lock Closed', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clock', exact: true })).toHaveCount(0);
  await search.clear();
  await expect(page.getByRole('button', { name: 'GitHub Logo', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('initially open primitive demos preserve page focus and autofocus real user reopens', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/primitives`);
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeEnabled();
  await expect(page.locator('body')).toBeFocused();
  const dialogArea = page.getByRole('group', { name: 'Dialog component demo', exact: true });
  const menuArea = page.getByRole('group', { name: 'Dropdown menu component demo', exact: true });
  await page.getByRole('link', { name: 'Get started', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(dialogArea).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(menuArea).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menuArea.getByRole('menuitem', { name: 'New Tab', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menuArea.getByRole('menuitem', { name: 'New Window', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menuArea.getByRole('menu')).toHaveCount(0);
  const menuTrigger = menuArea.getByRole('button', { name: 'Options', exact: true });
  await expect(menuTrigger).toBeFocused();
  await menuTrigger.press('ArrowDown');
  await expect(menuArea.getByRole('menuitem', { name: 'New Tab', exact: true })).toBeFocused();
  await dialogArea.getByRole('button', { name: 'Close profile editor', exact: true }).click();
  await expect(dialogArea.getByRole('dialog')).toHaveCount(0);
  await dialogArea.getByRole('button', { name: 'Edit Profile', exact: true }).click();
  await expect(dialogArea.getByRole('textbox', { name: 'Name', exact: true })).toBeFocused();
  const popoverArea = page.getByRole('group', { name: 'Popover component demo', exact: true });
  await popoverArea.getByRole('button', { name: 'Close dimensions', exact: true }).click();
  await expect(popoverArea.getByRole('dialog')).toHaveCount(0);
  await popoverArea.getByRole('button', { name: 'Dimensions', exact: true }).click();
  await expect(popoverArea.getByRole('textbox', { name: 'Width', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test('custom palettes restore six shared colors, reject invalid edits and preserve appearance-specific values', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  const query = 'accent-light=E2644B&accent-dark=7C66DC&gray-light=81878D&gray-dark=797484&bg-light=FFF8EF&bg-dark=171018&from=consumer';
  const response = await page.goto(`${origin}/colors/custom?${query}#palette`);
  expect(response?.status()).toBe(200);
  const accent = page.getByRole('textbox', { name: 'Accent', exact: true });
  const gray = page.getByRole('textbox', { name: 'Gray', exact: true });
  const background = page.getByRole('textbox', { name: 'Background', exact: true });
  await expect(accent).toBeEnabled();
  await expect(accent).toHaveValue('E2644B');
  await expect(gray).toHaveValue('81878D');
  await expect(background).toHaveValue('FFF8EF');
  await accent.fill('F00xyz');
  await accent.press('Enter');
  await expect(accent).toHaveValue('E2644B');
  expect(new URL(page.url()).searchParams.get('accent-light')).toBe('E2644B');
  await accent.fill('00AA88');
  await accent.press('Enter');
  await expect(accent).toHaveValue('00AA88');
  await page.getByRole('radio', { name: 'Dark', exact: true }).click();
  await expect(accent).toHaveValue('7C66DC');
  await expect(gray).toHaveValue('797484');
  await expect(background).toHaveValue('171018');
  await accent.fill('FEAB60');
  await accent.press('Enter');
  await expect(accent).toHaveValue('FEAB60');
  await expect.poll(() => new URL(page.url()).searchParams.get('accent-dark')).toBe('FEAB60');
  const shared = new URL(page.url());
  expect(shared.searchParams.get('accent-light')).toBe('00AA88');
  expect(shared.searchParams.get('from')).toBe('consumer');
  expect(shared.hash).toBe('#palette');
  const cookie = (await page.context().cookies()).find(cookie => cookie.name === 'colors-custom-palette');
  expect(cookie?.path).toBe('/colors/custom');
  expect(JSON.parse(decodeURIComponent(cookie!.value))).toEqual({
    lightAccent: '#00AA88', darkAccent: '#FEAB60', lightGray: '#81878D',
    darkGray: '#797484', lightBg: '#FFF8EF', darkBg: '#171018',
  });
  await page.reload();
  await expect(accent).toBeEnabled();
  await expect(accent).toHaveValue('FEAB60');
  await page.getByRole('radio', { name: 'Light', exact: true }).click();
  await expect(accent).toHaveValue('00AA88');
  await accent.fill('80868C');
  await accent.press('Enter');
  const previewButton = page.getByRole('button', { name: 'Submit', exact: true });
  await expect(previewButton).toHaveCSS('background-color', 'rgb(128, 134, 140)');
  // A low-saturation accent resolves to the generated custom palette; the portalled Copy menu must paint with the same accent.
  // The Copy menu is modal and hides the rest of the page from the accessibility tree, so read the preview paint first.
  const previewPaint = await previewButton.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  const paletteUrl = page.getByRole('menuitem', { name: 'Copy palette URL', exact: true });
  await paletteUrl.hover();
  await expect(paletteUrl).toHaveAttribute('data-highlighted', '');
  await expect.poll(() => paletteUrl.evaluate(node => getComputedStyle(node).backgroundColor), { message: 'portalled menu highlight uses the custom accent' }).toBe(previewPaint);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.getByRole('radio', { name: 'Dark', exact: true }).click();
  await accent.fill('909090');
  await accent.press('Enter');
  await expect(previewButton).toHaveCSS('background-color', 'rgb(144, 144, 144)');
  const swatch = page.getByRole('button', { name: 'accent 9', exact: true });
  await swatch.click();
  const details = page.getByRole('dialog', { name: 'Accent 9', exact: true });
  await details.getByRole('button', { name: 'Learn more about alpha colors', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Alpha colors', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(details).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(swatch).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/colors/progressions`);
  await expect(page.getByText('Range 10–50', { exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeEnabled();
  const navigationTrigger = page.getByRole('button', { name: 'Open navigation', exact: true });
  await navigationTrigger.click();
  const navigation = page.getByRole('dialog', { name: 'Navigation', exact: true });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('button', { name: 'Close navigation', exact: true }).first().hover();
  await page.keyboard.press('Escape');
  await expect(navigationTrigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('document metadata supplies a primary heading only when the source has none', async ({ page }) => {
  for (const [path, title] of [['/themes/docs/components/select', 'Select'], ['/primitives/docs/components/dialog', 'Dialog']]) {
    await page.goto(`${origin}${path}`);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveCount(1);
    await expect(heading).toHaveText(title!);
    await expect(heading).toBeVisible();
  }
});

test('settled documentation, palette navigation and example controls remain accessible', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) errors.push(message.text()); });
  for (const path of ['/primitives/docs/components/dialog', '/themes/docs/components/select', '/themes/docs/components/slider', '/colors/custom', '/themes/example-music-app', '/themes/example-dashboard', '/themes/example-ecommerce']) {
    await page.goto(`${origin}${path}`);
    await page.evaluate(() => document.fonts.ready);
    if (path.endsWith('example-music-app')) await page.getByRole('switch', { name: 'Equalizer', exact: true }).click();
    else if (path.endsWith('example-dashboard')) await expect(page.getByRole('checkbox', { name: /Respond to comment/ })).toBeEnabled();
    else if (path.endsWith('example-ecommerce')) await expect(page.getByRole('button', { name: 'XS', exact: true })).toBeEnabled();
    else await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeEnabled();
    expect(await accessibilityViolations(page), path).toEqual([]);
    if (path === '/primitives/docs/components/dialog') {
      await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Edit profile', exact: true })).toBeVisible();
      expect(await accessibilityViolations(page)).toEqual([]);
      await page.keyboard.press('Escape');
    }
  }
  expect(errors).toEqual([]);
});

test('palette and dashboard todo toggles preserve the focused checkbox host', async ({ page }) => {
  for (const path of ['/colors/custom', '/themes/example-dashboard']) {
    await page.goto(`${origin}${path}`);
    const checkbox = page.getByRole('checkbox', { name: /Respond to comment/ });
    await checkbox.focus();
    await checkbox.evaluate(node => Reflect.set(window, '__todoHost', node));
    const previous = await checkbox.getAttribute('aria-checked');
    await checkbox.press('Space');
    await expect(checkbox).toHaveAttribute('aria-checked', previous === 'true' ? 'false' : 'true');
    await expect(checkbox).toBeFocused();
    expect(await checkbox.evaluate(node => node === Reflect.get(window, '__todoHost'))).toBe(true);
    const hasStrikethrough = () => page.getByText('Respond to comment', { exact: false }).last().evaluate(node => {
      for (let current: Element | null = node; current && current.tagName !== 'LABEL'; current = current.parentElement) {
        if (getComputedStyle(current).textDecorationLine.includes('line-through')) return true;
      }
      return false;
    });
    await expect.poll(hasStrikethrough).toBe(previous !== 'true');
    await checkbox.press('Space');
    await expect.poll(hasStrikethrough).toBe(previous === 'true');
  }
});

test('dashboard company card preserves its gradient, shadow and rounded corners', async ({ page }) => {
  await page.goto(`${origin}/themes/example-dashboard`);
  const card = page.getByText('Sophie Johnson', { exact: true }).locator('..');
  await expect(card).toHaveCSS('background-image', /linear-gradient/);
  await expect(card).not.toHaveCSS('box-shadow', 'none');
  await expect(card).not.toHaveCSS('border-top-left-radius', '0px');
});

test('dashboard icon actions expose descriptive accessible names and pin state', async ({ page }) => {
  await page.goto(`${origin}/themes/example-dashboard`);
  for (const button of await page.getByRole('button').all()) await expect(button).not.toHaveAccessibleName('');
  const finance = page.getByRole('button', { name: 'Pin financial performance', exact: true });
  await expect(finance).toHaveAttribute('aria-pressed', 'false');
  await finance.click();
  await expect(finance).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /^Member actions for / }).first().click();
  await expect(page.getByRole('menuitem', { name: 'View profile', exact: true })).toBeVisible();
});

test('ColorField round trips standard hyphenated CSS color spaces without corrupting the palette', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/colors/custom`);
  const accent = page.getByRole('textbox', { name: 'Accent', exact: true });
  for (const space of ['srgb-linear', 'a98-rgb', 'prophoto-rgb', 'xyz-d50', 'xyz-d65']) {
    await accent.fill(`color(${space} 0.2 0.3 0.4)`);
    await accent.press('Enter');
    await expect(accent).toHaveValue(`${space} 0.2 0.3 0.4`);
    await expect(accent).not.toHaveAttribute('aria-invalid', 'true');
    await expect.poll(() => new URL(page.url()).searchParams.get('accent-light')).toBe(`color(${space} 0.2 0.3 0.4)`);
  }
  expect(errors).toEqual([]);
});

test('hydrated icon copying writes standalone SVG to the native clipboard', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Native clipboard read permission is supported by Chromium.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  await page.goto(`${origin}/icons`);
  const icon = page.getByRole('button', { name: 'Font Style', exact: true });
  const geometry = await icon.locator('svg').evaluate(svg => [...svg.querySelectorAll('path')].map(path => path.getAttribute('d')));
  await icon.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('<svg');
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).not.toMatch(/_hk=|<!--/);
  expect(await page.evaluate(svg => {
    const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
    return {
      namespace: parsed.documentElement.namespaceURI,
      viewBox: parsed.documentElement.getAttribute('viewBox'),
      paths: [...parsed.querySelectorAll('path')].map(path => path.getAttribute('d')),
      error: !!parsed.querySelector('parsererror'),
    };
  }, clipboard)).toEqual({ namespace: 'http://www.w3.org/2000/svg', viewBox: '0 0 15 15', paths: geometry, error: false });
});

test('global search shortcuts retain input focus and Enter opens the first result', async ({ page }) => {
  await page.goto(origin);
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true }).first()).toBeEnabled();
  const documentationLink = page.getByRole('link', { name: 'Documentation', exact: true }).first();
  await documentationLink.focus();
  for (const shortcut of ['/', 'Control+k']) {
    await page.keyboard.press(shortcut);
    await expect(page.getByRole('dialog', { name: 'Search documentation', exact: true })).toHaveCount(1);
    await expect(page.getByRole('combobox', { name: 'Search documentation', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(documentationLink).toBeFocused();
  }
  await page.goto(`${origin}/primitives/docs/components/dialog`);
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeEnabled();
  await page.keyboard.press('/');
  const search = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  const input = search.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('asynchronous form');
  await expect(search.getByRole('option').first()).toContainText('Close after asynchronous form submission');
  await expect(input).toBeFocused();
  await input.press('Enter');
  await page.waitForURL(/#close-after-asynchronous-form-submission$/, { waitUntil: 'load' });
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeEnabled();
  await page.keyboard.press('Control+k');
  await expect(input).toBeFocused();
});

test('component indexes, document references and article layouts retain navigation contracts', async ({ page, request }) => {
  for (const family of ['primitives', 'themes']) {
    const path = `/${family}/docs/components`;
    expect((await request.get(`${origin}${path}`)).status()).toBe(200);
    await page.goto(`${origin}${path}`);
    await expect(page.getByRole('main').getByRole('link').filter({ has: page.getByRole('heading', { level: 2, name: 'Dialog', exact: true }) })).toHaveAttribute('href', `${path}/dialog`);
    expect((await request.get(`${origin}${path}.md`)).status()).toBe(200);
  }
  await page.goto(`${origin}/primitives/docs/components/dialog`);
  await expect(page.getByRole('link', { name: 'View as Markdown', exact: true })).toHaveAttribute('href', '/primitives/docs/components/dialog.md');
  await expect(page.getByRole('link', { name: 'ARIA design pattern', exact: true })).toHaveAttribute('href', /w3\.org/);
  await expect(page.getByRole('navigation', { name: 'In this article', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Documentation pagination', exact: true })).toBeVisible();
  await page.goto(`${origin}/blog/themes-3`);
  await expect(page.getByRole('navigation', { name: 'Blog', exact: true })).toBeVisible();
  await expect(page.getByRole('main').locator('time')).toBeVisible();
  await page.goto(`${origin}/primitives/case-studies/vercel`);
  await expect(page.getByText('Case study', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About Vercel', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Documentation', exact: true })).toHaveCount(0);
});

test('live MDX expressions retain valid native structure and documented data attributes', async ({ page }) => {
  await page.goto(`${origin}/themes/docs/components/button`);
  expect(await page.locator('.live-example').evaluateAll(examples => examples.some(example => !!example.querySelector('p > button, button p')))).toBe(false);
  await page.goto(`${origin}/themes/docs/components/heading`);
  const headingExample = page.locator('.live-example').first();
  await expect(headingExample.getByRole('heading', { level: 1, name: 'The quick brown fox jumps over the lazy dog', exact: true })).toBeVisible();
  await expect(headingExample.locator('p')).toHaveCount(0);
  await page.goto(`${origin}/primitives/docs/components/dialog`);
  const table = page.getByRole('table').filter({ has: page.getByText('[data-state]', { exact: true }) }).first();
  await expect(table.getByRole('columnheader')).toHaveText(['Data attribute', 'Values']);
  const stateRow = table.getByRole('row').filter({ has: page.getByRole('rowheader', { name: '[data-state]', exact: true }) });
  await expect(stateRow.getByRole('cell')).toHaveText('"open" | "closed"');
});

test('search indexes Themes document titles supplied by metadata rather than source headings', async ({ request }) => {
  const index = await (await request.get(`${origin}/search-index.json`)).json();
  expect(index).toContainEqual(expect.objectContaining({
    url: '/themes/docs/components/select#select',
    type: 'lvl1',
    hierarchy: expect.objectContaining({ lvl1: 'Select' }),
  }));
  expect(index).toContainEqual(expect.objectContaining({
    url: '/themes/docs/components/select#root',
    hierarchy: expect.objectContaining({ lvl1: 'Select', lvl2: 'API Reference', lvl3: 'Root' }),
  }));
});

test('historical Skeleton example retains accessible native field labels after loading', async ({ page }) => {
  await page.goto(`${origin}/blog/themes-3`);
  await page.getByRole('button', { name: 'Toggle loading', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Email address', exact: true })).toHaveAttribute('id', 'skeleton-email');
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('id', 'skeleton-password');
});

test('documentation code retains selected highlights and native expand controls', async ({ page }) => {
  await page.goto(`${origin}/primitives/docs/guides/composition`);
  const unselected = page.locator('.source-code [data-highlighted="false"]').first();
  await expect(unselected).toBeVisible();
  expect(await unselected.evaluate(node => getComputedStyle(node).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  expect(await page.locator('.source-code [data-highlighted="true"]').first().evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await page.goto(`${origin}/primitives/docs/components/dialog`);
  const expand = page.getByRole('button', { name: 'Expand code', exact: true });
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
  const contentId = await expand.getAttribute('aria-controls');
  expect(contentId).toBeTruthy();
  await expand.click();
  const collapse = page.getByRole('button', { name: 'Collapse code', exact: true });
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator(`[id="${contentId}"]`)).toBeFocused();
  await collapse.click();
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator(`[id="${contentId}"]`)).toHaveCSS('height', '150px');
});

test('documentation code copies native factories without word highlight annotations', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Native clipboard read permission is supported by Chromium.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  await page.goto(`${origin}/primitives/docs/guides/composition`);
  const block = page.locator('.source-code').first();
  await block.hover();
  await block.getByRole('button', { name: 'Copy code to clipboard', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('asChild');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('<Tooltip.Root>');
  expect(copied).not.toMatch(/__asChild__|<span|data-highlighted/);
});

test('curated documentation navigation and native Markdown retain their public controls', async ({ page, request }) => {
  await page.goto(`${origin}/primitives/docs/components/form`);
  const navigation = page.getByRole('navigation', { name: 'Documentation', exact: true });
  await expect(navigation.getByRole('heading', { name: 'Utilities', exact: true })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Form Preview', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View original source', exact: true })).toHaveAttribute('href', /radix-ui\/primitives/);
  await page.goto(`${origin}/colors/docs/overview/installation`);
  await expect(page.locator('.document-note').first()).toBeVisible();
  const html = await (await request.get(`${origin}/primitives/docs/guides/server-side-rendering.md`)).text();
  expect(html).toContain('renderToString');
  expect(html).toContain('renderId');
  expect(html).not.toContain('upgrading to React 18');
});

test('charts landing hydrates one chart per container, switches chart type and ships its license notices', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/charts`);
  await expect(page.getByRole('navigation', { name: 'Products', exact: true }).filter({ visible: true }).getByRole('link', { name: 'Charts', exact: true })).toHaveAttribute('data-state', 'active');
  const demo = page.locator('.hero-demo');
  // One root SVG per chart: duplicated hydration output would render a second surface.
  await expect(demo.locator('.recharts-wrapper > svg.recharts-surface')).toHaveCount(1);
  await expect(demo.locator('.recharts-line-curve')).toHaveCount(2);
  // A tooltip on hover needs the hydrated, measured chart; then the settled axis must not keep a stale server tick.
  const chart = demo.locator('.recharts-wrapper');
  const box = await chart.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(demo.locator('.recharts-tooltip-wrapper')).toBeVisible();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const labels = await demo.locator('.recharts-xAxis .recharts-cartesian-axis-tick text').allTextContents();
  expect(labels, 'x-axis labels are an ordered, unique subset of the data').toEqual(months.filter(month => labels.includes(month)));
  expect(labels.filter(label => label === 'Jun')).toEqual(['Jun']);
  await demo.getByRole('button', { name: 'Bar', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Bar', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.locator('.recharts-bar-rectangle')).toHaveCount(12);
  await expect(demo.locator('.recharts-wrapper > svg.recharts-surface')).toHaveCount(1);
  const families = page.locator('a[href^="/charts/docs/components/"]').filter({ has: page.locator('.recharts-wrapper') });
  await expect(families).toHaveCount(12);
  for (const family of await families.all()) await expect(family.locator('.recharts-wrapper > svg.recharts-surface')).toHaveCount(1);
  const download = page.getByRole('link', { name: 'Download package', exact: true });
  expect((await request.get(`${origin}${await download.getAttribute('href')}`)).status()).toBe(200);
  const notice = await (await request.get(`${origin}/NOTICE.txt`)).text();
  for (const text of ['Copyright (c) 2026 Thomas Guehenneux', 'Copyright (c) 2015-present recharts', '--- d3-scale@', '--- d3-shape@', '--- internmap@', '--- solid-js@2.0.0-rc.15 ', '--- @floating-ui/dom@', 'Copyright (c) 2022 WorkOS']) expect(notice).toContain(text);
  await page.goto(`${origin}/charts/docs/overview/introduction`);
  await expect(page.getByRole('heading', { name: 'Licensing', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('narrow header product links stay reachable by Tab without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(`${origin}/charts/docs/overview/introduction`);
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true }).first()).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth), 'the page does not overflow at 320px').toBeLessThanOrEqual(320);
  // Below 768px the product row lives in the mobile navigation's header, as on the original site.
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  const products = page.getByRole('dialog', { name: 'Navigation', exact: true }).getByRole('navigation', { name: 'Products', exact: true });
  for (const name of ['Themes', 'Primitives', 'Icons', 'Charts', 'Colors']) {
    const link = products.getByRole('link', { name, exact: true });
    for (let presses = 0; presses < 40 && !(await link.evaluate(node => node === document.activeElement)); presses++) await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    await expect.poll(async () => {
      const bounds = (await link.boundingBox())!;
      return bounds.x >= 0 && bounds.x + bounds.width <= 320;
    }, { message: `${name}: focused product link is scrolled into view` }).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth), 'the open navigation does not widen the page').toBeLessThanOrEqual(320);
});

test('Themes recipes are navigable and the profile menu submits its native logout form once', async ({ page }) => {
  await page.goto(`${origin}/themes/docs/recipes/accordion`);
  const navigation = page.getByRole('navigation', { name: 'Documentation', exact: true });
  await expect(navigation.getByRole('heading', { name: 'Recipes', exact: true })).toBeVisible();
  for (const slug of ['accordion', 'collapsible', 'toast', 'toggle-group', 'toolbar', 'profile-menu']) await expect(navigation.locator(`a[href="/themes/docs/recipes/${slug}"]`)).toHaveCount(1);
  await page.goto(`${origin}/themes/docs/recipes/profile-menu`);
  await expect(page.getByRole('button', { name: 'Toggle theme', exact: true }).first()).toBeEnabled();
  const trigger = page.getByRole('button', { name: 'Profile menu for Ana Horvat', exact: true });
  const menu = page.getByRole('menu').first();
  const submenuTrigger = page.getByRole('menuitem', { name: 'Help', exact: true });
  const shortcuts = page.getByRole('menuitem', { name: 'Keyboard shortcuts', exact: true });
  for (const direction of ['ltr', 'rtl'] as const) {
    if (direction === 'rtl') await page.getByRole('button', { name: 'Use right-to-left', exact: true }).click();
    const [open, close] = direction === 'ltr' ? ['ArrowRight', 'ArrowLeft'] : ['ArrowLeft', 'ArrowRight'];
    for (const key of ['Enter', ' ', 'ArrowDown']) {
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(menu, `${direction} ${key} opens the menu`).toBeVisible();
      await expect(page.getByRole('menuitemradio', { name: 'Online', exact: true }), `${direction} ${key} focuses the first item`).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(trigger, `${direction} Escape returns focus`).toBeFocused();
    }
    await page.keyboard.press('Enter');
    await submenuTrigger.focus();
    await page.keyboard.press(open);
    await expect(shortcuts, `${direction} ${open} opens Help and focuses its first item`).toBeFocused();
    await page.keyboard.press(close);
    await expect(shortcuts).toBeHidden();
    await expect(submenuTrigger, `${direction} ${close} closes Help`).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('menuitem', { name: 'Documentation', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
  // The demo cancels the POST; check what the native submit event carries, not a server response.
  const tokenField = page.locator('form[method="post"][action="/logout"] input[type="hidden"][name="csrf_token"]');
  await expect(tokenField, 'the hidden field carries a token').toHaveValue(/\S/);
  const token = await tokenField.inputValue();
  await page.evaluate(() => {
    const submissions: { method: string; action: string; token: FormDataEntryValue | null }[] = [];
    Object.assign(window, { logoutSubmissions: submissions });
    document.addEventListener('submit', event => {
      const form = event.target as HTMLFormElement;
      submissions.push({ method: form.method, action: new URL(form.action).pathname, token: new FormData(form).get('csrf_token') });
    }, true);
  });
  await trigger.click();
  const logout = page.getByRole('menuitem', { name: 'Log out', exact: true });
  await expect(logout).not.toHaveAttribute('data-disabled');
  await logout.click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { logoutSubmissions: unknown[] }).logoutSubmissions), { message: 'one native POST submission to /logout with the rendered token' })
    .toEqual([{ method: 'post', action: '/logout', token }]);
});

test('Themes recipe targets keep their visual and accessible state in step with the primitive', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  // Selected/deselected paint is captured from the initial render, then compared after the pointer leaves so hover paint cannot mask it.
  const paint = (control: Locator) => control.evaluate(node => getComputedStyle(node).backgroundColor);
  const settle = () => page.mouse.move(0, 0);
  await page.goto(`${origin}/themes/docs/recipes/toggle-group`);
  const center = page.getByRole('radio', { name: 'Center aligned', exact: true });
  const right = page.getByRole('radio', { name: 'Right aligned', exact: true });
  await expect(center).toHaveAttribute('aria-checked', 'true');
  const [selected, deselected] = [await paint(center), await paint(right)];
  expect(selected, 'selected and deselected alignments are painted differently').not.toBe(deselected);
  await right.click();
  await settle();
  await expect(right).toHaveAttribute('aria-checked', 'true');
  await expect(center).toHaveAttribute('aria-checked', 'false');
  await expect.poll(() => paint(right), { message: 'newly selected alignment takes the selected paint' }).toBe(selected);
  await expect.poll(() => paint(center), { message: 'deselected alignment returns to the deselected paint' }).toBe(deselected);

  await page.goto(`${origin}/themes/docs/recipes/toolbar`);
  const bold = page.getByRole('button', { name: 'Bold', exact: true });
  const italic = page.getByRole('button', { name: 'Italic', exact: true });
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
  await expect(italic).toHaveAttribute('aria-pressed', 'false');
  const [pressed, released] = [await paint(bold), await paint(italic)];
  expect(pressed, 'pressed and released marks are painted differently').not.toBe(released);
  await italic.click();
  await settle();
  await expect(italic).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => paint(italic), { message: 'pressed mark takes the pressed paint' }).toBe(pressed);
  await bold.click();
  await settle();
  await expect(bold).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => paint(bold), { message: 'released mark returns to the released paint' }).toBe(released);

  await page.goto(`${origin}/themes/docs/recipes/collapsible`);
  const show = page.getByRole('button', { name: 'Show repositories', exact: true });
  await expect(show).toHaveAttribute('aria-expanded', 'false');
  const collapsedIcon = await show.locator('svg').innerHTML();
  await show.click();
  const hide = page.getByRole('button', { name: 'Hide repositories', exact: true });
  await expect(hide, 'expanded trigger announces the hide action').toHaveAttribute('aria-expanded', 'true');
  const content = page.locator(`[id="${await hide.getAttribute('aria-controls')}"]`);
  await expect(content, 'the trigger controls the content it reveals').toBeVisible();
  expect(await hide.locator('svg').innerHTML(), 'expanded trigger swaps its icon').not.toBe(collapsedIcon);
  await hide.click();
  await expect(page.getByRole('button', { name: 'Show repositories', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(content, 'collapsing hides the controlled content').toBeHidden();
  expect(await show.locator('svg').innerHTML()).toBe(collapsedIcon);

  await page.goto(`${origin}/themes/docs/recipes/accordion`);
  const first = page.getByRole('button', { name: 'Is it accessible?', exact: true });
  const second = page.getByRole('button', { name: 'Does it follow the theme?', exact: true });
  const firstAnswer = page.getByText('Yes. It follows the WAI-ARIA accordion pattern.', { exact: true });
  const secondAnswer = page.getByText('Yes. Colors, radius and scaling come from the nearest Theme.', { exact: true });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(firstAnswer).toBeVisible();
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await second.click();
  await expect(second, 'single accordion expands the chosen item').toHaveAttribute('aria-expanded', 'true');
  await expect(secondAnswer).toBeVisible();
  await expect(first, 'single accordion collapses the previous item').toHaveAttribute('aria-expanded', 'false');
  await expect(firstAnswer).toBeHidden();
  await second.click();
  await expect(second, 'collapsible accordion closes the open item').toHaveAttribute('aria-expanded', 'false');
  await expect(secondAnswer).toBeHidden();

  await page.goto(`${origin}/themes/docs/recipes/toast`);
  const notify = page.getByRole('button', { name: 'Show notification', exact: true });
  const title = page.getByText('Example notification', { exact: true });
  await expect(title).toHaveCount(0);
  for (const round of [1, 2]) {
    await notify.click();
    await expect(title, `toast ${round} opens`).toBeVisible();
    await expect(page.getByText('Dismiss it, swipe it right or let the timer close it.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(title, `toast ${round} Close dismisses it`).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('playground charts render every family once with the page theme tokens', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/themes/playground#charts`);
  await expect(page.locator('#charts')).toBeVisible();
  await expect(page.locator('.recharts-wrapper')).toHaveCount(12);
  await expect(page.locator('.recharts-wrapper > svg.recharts-surface')).toHaveCount(12);
  expect(await page.locator('.recharts-line-curve').first().evaluate(node => getComputedStyle(node).stroke)).not.toBe('none');
  expect(errors).toEqual([]);
});
