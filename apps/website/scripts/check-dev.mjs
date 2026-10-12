import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer as createHttpServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
let vite;
let server;
try {
  vite = await createServer({ root, configFile: `${root}vite.config.ts`, appType: 'custom', server: { middlewareMode: true, hmr: false } });
  server = createHttpServer((request, response) => {
    vite.middlewares(request, response, async () => {
      try {
        const path = new URL(request.url, 'http://127.0.0.1').pathname.replace(/\/$/, '') || '/';
        const { renderPage, routePaths } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const html = await renderPage(path, '/src/entry-client.tsx', []);
        response.writeHead(routePaths.includes(path) ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(await vite.transformIndexHtml(request.url, html));
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error(error);
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end(error.stack);
      }
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await type.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1365, height: 900 }, colorScheme: 'light' });
      const errors = [];
      page.on('pageerror', error => { errors.push(error.message); console.error(engine, error.stack); });
      page.on('console', message => {
        console.log(engine, message.type(), message.text());
        if (message.type() === 'error') errors.push(message.text());
      });
      assert.equal((await page.goto(origin)).status(), 200);
      const example = page.getByRole('button', { name: 'Example 2', exact: true });
      await example.click();
      await expect(example).toHaveAttribute('data-visibility', 'visible');
      await page.getByRole('button', { name: 'Example 3', exact: true }).click();
      await expect(example).toHaveAttribute('data-visibility', 'hidden');
      await page.getByRole('button', { name: 'Example 3', exact: true }).press('ArrowLeft');
      await expect(example).toHaveAttribute('data-visibility', 'visible');
      assert.equal((await page.goto(`${origin}/primitives/docs/components/progress`)).status(), 200);
      const toggle = page.getByRole('button', { name: 'Toggle theme', exact: true });
      await expect(toggle).toBeEnabled();
      const code = page.locator('main a[href^="http"] code').first();
      await expect(code).toBeVisible();
      const host = await code.elementHandle();
      const text = await code.textContent();
      const theme = page.locator('[data-is-root-theme="true"]').first();
      const color = await theme.evaluate(node => getComputedStyle(node).color);
      await toggle.click();
      await expect.poll(() => theme.evaluate(node => getComputedStyle(node).color)).not.toBe(color);
      assert(await host.evaluate(node => node.isConnected), 'Native inline code host survives the theme transition');
      assert.equal(await host.textContent(), text);
      assert.deepEqual(errors, [], `${engine}: unexpected runtime errors`);
      console.log(`${engine}: native DEV home controls and Progress hydration/theme passed`);
    } finally {
      await browser.close();
    }
  }
} finally {
  server?.closeAllConnections();
  await Promise.all([
    vite?.close(),
    server?.listening ? new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())) : undefined,
  ]);
}
