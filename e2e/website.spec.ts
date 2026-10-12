import { expect, test } from '@playwright/test';
import { accessibilityViolations } from './accessibility.js';

const origin = 'http://127.0.0.1:4149';

for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) {
  test(`primary GitHub control links to the native library at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/primitives', '/icons', '/colors', '/themes/playground', '/primitives/docs/components/dialog', '/themes/docs/components/dialog', '/colors/docs/palette-composition/scales', '/blog/themes-3', '/primitives/case-studies/vercel']) {
      await page.goto(`${origin}${path}`);
      const github = page.getByRole('link', { name: 'View GitHub', exact: true }).filter({ visible: true });
      await expect(github).toHaveCount(1);
      await expect(github).toHaveAttribute('href', 'https://github.com/klukacin/radix2solid');
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
    await expect(references.getByRole('link', { name: 'View documentation source', exact: true })).toHaveAttribute('href', `https://github.com/klukacin/radix2solid-web/blob/main/${file}`);
    await expect(references.getByRole('link', { name: 'Edit documentation', exact: true })).toHaveAttribute('href', `https://github.com/klukacin/radix2solid-web/edit/main/${file}`);
    await expect(references.getByRole('link', { name: 'Report native issue', exact: true })).toHaveAttribute('href', 'https://github.com/klukacin/radix2solid/issues/new');
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
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"], meta[property="og:url"], meta[name="twitter:site"]')).toHaveCount(0);
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

test('settled documentation, palette navigation and Music controls remain accessible', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) errors.push(message.text()); });
  for (const path of ['/primitives/docs/components/dialog', '/themes/docs/components/select', '/themes/docs/components/slider', '/colors/custom', '/themes/example-music-app']) {
    await page.goto(`${origin}${path}`);
    await page.evaluate(() => document.fonts.ready);
    if (path.endsWith('example-music-app')) await page.getByRole('switch', { name: 'Equalizer', exact: true }).click();
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
