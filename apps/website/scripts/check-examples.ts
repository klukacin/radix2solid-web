import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, preview } from 'vite';
import solid from '@solidjs/vite-plugin';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import matter from 'gray-matter';
import rehypeParse from 'rehype-parse';
import type { Root, RootContent } from 'hast';

const root = resolve(import.meta.dirname, '../../..');
await mkdir(resolve(root, '.artifacts'), { recursive: true });
const fixture = await mkdtemp(resolve(root, '.artifacts/native-guide-examples-'));
const examples = {
  Animation: 'primitives/docs/guides/animation.mdx',
  SystemTheme: 'themes/docs/theme/dark-mode.mdx',
};
try {
  for (const [name, path] of Object.entries(examples)) {
    const content = matter(await readFile(resolve(import.meta.dirname, '../data', path), 'utf8')).content;
    const tree = unified().use(remarkParse).use(remarkMdx).parse(content);
    const code = tree.children.findLast(node => node.type === 'code' && node.lang === 'tsx');
    assert(code?.type === 'code', `Missing complete native example in ${path}`);
    await writeFile(resolve(fixture, `${name}.tsx`), code.value);
  }
  await writeFile(resolve(fixture, 'scene.tsx'), `
import { createSignal } from 'solid-js';
import { Theme } from '@radix-solid/themes';
import Animation from './Animation';
import SystemTheme from './SystemTheme';
export default function Scene() {
  const [mounted, setMounted] = createSignal(true);
  return <Theme>
    <SystemTheme><span data-system-appearance>System appearance</span></SystemTheme>
    <section data-animation-scene>{mounted() && <Animation />}</section>
    <button data-unmount onClick={() => setMounted(false)}>Unmount example</button>
  </Theme>;
}
`);
  await writeFile(resolve(fixture, 'entry.tsx'), "import { render } from '@solidjs/web'; import '@radix-solid/themes/styles.css'; import Scene from './scene'; render(() => <Scene />, document.getElementById('root')!);\n");
  await writeFile(resolve(fixture, 'entry-server.tsx'), "import { renderToString } from '@solidjs/web'; import Scene from './scene'; export const html = renderToString(() => <Scene />);\n");
  await writeFile(resolve(fixture, 'index.html'), '<!doctype html><html><body><div id="root"></div><script type="module" src="/entry.tsx"></script></body></html>');
  const config = { root: fixture, configFile: false as const, plugins: [solid({ ssr: true })], resolve: { dedupe: ['solid-js', '@solidjs/web', '@solidjs/signals'] }, logLevel: 'warn' as const };
  await build({ ...config, build: { outDir: 'dist' } });
  await build({ ...config, build: { ssr: 'entry-server.tsx', outDir: 'server', rolldownOptions: { output: { entryFileNames: 'entry-server.js' } } } });
  const { html } = await import(pathToFileURL(resolve(fixture, 'server/entry-server.js')).href);
  let initialAppearance: unknown;
  const visit = (node: Root | RootContent) => {
    if (node.type === 'element' && node.children.some(child => child.type === 'element' && 'dataSystemAppearance' in child.properties)) {
      initialAppearance = node.properties.className;
    }
    if ('children' in node) node.children.forEach(visit);
  };
  visit(unified().use(rehypeParse, { fragment: true }).parse(html));
  assert(Array.isArray(initialAppearance) && initialAppearance.includes('light') && !initialAppearance.includes('dark'), 'System appearance must match the initial light SSR contract');
  assert.doesNotMatch(html, /role="dialog"/);
  const server = await preview({ ...config, build: { outDir: 'dist' }, preview: { host: '127.0.0.1', port: 0 } });
  const address = server.httpServer.address();
  assert(address && typeof address !== 'string');
  try {
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      const browser = await engine.launch();
      const failures: string[] = [];
      try {
        const page = await browser.newPage({ colorScheme: 'light' });
        page.on('pageerror', error => failures.push(error.message));
        page.on('console', message => { if (['warning', 'error'].includes(message.type())) failures.push(message.text()); });
        await page.goto(`http://127.0.0.1:${address.port}`);
        const appearance = page.locator('[data-system-appearance]').locator('..');
        await expect(appearance).toHaveClass(/\blight\b/);
        await page.emulateMedia({ colorScheme: 'dark' });
        await expect(appearance).toHaveClass(/\bdark\b/);
        await page.emulateMedia({ colorScheme: 'light' });
        await expect(appearance).toHaveClass(/\blight\b/);
        const trigger = page.locator('[data-animation-scene]').getByRole('button');
        const dialog = page.locator('[role="dialog"]');
        await trigger.click();
        await expect(dialog).toHaveAttribute('data-state', 'open');
        await dialog.getByRole('button').click();
        await trigger.click();
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.getAnimations().every(animation => animation.playState === 'finished'));
        await expect(dialog).toHaveAttribute('data-state', 'open');
        await dialog.getByRole('button').click();
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await trigger.click();
        await dialog.getByRole('button').click();
        await expect(dialog).toHaveCount(0);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await trigger.click();
        await dialog.getByRole('button').click();
        await page.locator('[data-unmount]').click();
        await expect(page.locator('[data-animation-scene] button')).toHaveCount(0);
        await expect(dialog).toHaveCount(0);
        assert.deepEqual(failures, [], `${name}: native copied guide exceptions/warnings/errors`);
        console.log(`${name}: copied animation enter/exit/reopen/unmount/reduced-motion and system appearance passed`);
      } finally { await browser.close(); }
    }
  } finally { await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())); }
} finally { await rm(fixture, { recursive: true, force: true }); }
