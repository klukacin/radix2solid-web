import assert from 'node:assert/strict';
import { mkdir, mkdtemp, open, readFile, readdir, rm, realpath, type FileHandle } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { preview } from 'vite';

const site = resolve(import.meta.dirname, '..');
const output = resolve(site, 'out/sandboxes');
const coverage: { sandboxes: string[] } = JSON.parse(await readFile(resolve(site, 'coverage-manifest.json'), 'utf8'));
const archives = (await readdir(output)).filter(name => name.endsWith('.tar.gz')).sort();
assert.equal(archives.length, 110, 'All 110 advertised archives must exist.');
assert.deepEqual(archives, [...coverage.sandboxes].sort());
const requested = process.argv.slice(2);
for (const archive of requested) assert(archives.includes(archive), `Unknown requested archive: ${archive}`);
const selectedArchives = requested.length ? archives.filter(archive => requested.includes(archive)) : archives;
const scratch = await mkdtemp(resolve(tmpdir(), 'radix2solid-sandboxes-'));
const logRoot = resolve(site, '../../.artifacts/sandboxes');
await mkdir(logRoot, { recursive: true });
const logs = await mkdtemp(resolve(logRoot, 'run-'));
const failures: string[] = [];
let cursor = 0;
type RuntimeFamily = 'dialog' | 'toast' | 'select' | 'charts' | 'combobox' | 'command' | 'tree' | 'splitter' | 'icons-extra';
const representatives: Record<string, RuntimeFamily> = {
  'dialog-css.tar.gz': 'dialog',
  'toast-css-modules.tar.gz': 'toast',
  'select-tailwind.tar.gz': 'select',
  'charts-css-modules.tar.gz': 'charts',
  'combobox-css-modules.tar.gz': 'combobox',
  'combobox-css.tar.gz': 'combobox',
  'combobox-tailwind.tar.gz': 'combobox',
  'command-css.tar.gz': 'command',
  'tree-tailwind.tar.gz': 'tree',
  'splitter-css-modules.tar.gz': 'splitter',
  'icons-extra-css-modules.tar.gz': 'icons-extra'
};
async function checkRuntime(project: string, family: RuntimeFamily, log: FileHandle) {
  const server = await preview({ root: project, configFile: false, preview: { host: '127.0.0.1', port: 0 } });
  try {
    const address = server.httpServer.address();
    assert(address && typeof address !== 'string');
    for (const engine of [chromium, firefox, webkit]) {
      const browser = await engine.launch();
      try {
        const page = await browser.newPage();
        const diagnostics: string[] = [];
        page.on('pageerror', error => diagnostics.push(error.message));
        page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') diagnostics.push(message.text()); });
        await page.goto(`http://127.0.0.1:${address.port}/`);
        if (family === 'dialog') {
          const trigger = page.getByRole('button', { name: 'Edit profile', exact: true });
          await trigger.click();
          const dialog = page.getByRole('dialog', { name: 'Edit profile', exact: true });
          await expect(dialog).toBeVisible();
          const name = dialog.getByRole('textbox', { name: 'Name', exact: true });
          await expect(name).toBeFocused();
          await name.fill('Independent archive consumer');
          await dialog.getByRole('button', { name: 'Save changes', exact: true }).click();
          await expect(dialog).not.toBeVisible();
          await expect(trigger).toBeFocused();
        } else if (family === 'toast') {
          await page.getByRole('button', { name: 'Add to calendar', exact: true }).click();
          const title = page.getByText('Scheduled: Catch up', { exact: true });
          await expect(title).toBeVisible();
          await page.getByRole('button', { name: 'Undo', exact: true }).click();
          await expect(title).not.toBeVisible();
        } else if (family === 'charts') {
          const chart = page.locator('svg.recharts-surface');
          await expect(chart.locator('.recharts-line-curve')).toHaveCount(2);
          const path = await chart.locator('.recharts-line-curve').first().getAttribute('d');
          assert.match(path ?? '', /^M[\d.]+,[\d.]+/, 'line geometry must be finite');
          await page.getByRole('button', { name: 'Bar', exact: true }).click();
          await expect(page.getByRole('button', { name: 'Bar', exact: true })).toHaveAttribute('aria-pressed', 'true');
          await expect(chart.locator('.recharts-bar-rectangle')).toHaveCount(12);
        } else if (family === 'combobox') {
          const input = page.getByRole('combobox', { name: 'Destination', exact: true });
          await input.fill('Paris');
          await input.press('ArrowDown');
          await input.press('Enter');
          await page.getByRole('button', { name: 'Book destination', exact: true }).click();
          await expect(page.getByLabel('Submitted destination', { exact: true })).toContainText('paris; count: 1');
          await input.fill('Unmatched');
          assert.equal(await page.getByRole('form', { name: 'Destination booking', exact: true }).evaluate(node => new FormData(node as HTMLFormElement).has('destination')), false);
          await input.press('Escape');
          await page.getByRole('checkbox', { name: 'Accept value proposals', exact: true }).uncheck();
          const form = page.getByRole('form', { name: 'Destination booking', exact: true });
          await form.evaluate(node => (node as HTMLFormElement).reset());
          await expect(page.getByRole('status', { name: 'Accepted destination', exact: true })).toHaveText('Key: paris');
          await expect(page.getByRole('status', { name: 'Destination query', exact: true })).toHaveText('Query: empty');
          await expect(input).toHaveValue('');
          assert.equal(await form.evaluate(node => new FormData(node as HTMLFormElement).has('destination')), false);
        } else if (family === 'command') {
          const input = page.getByRole('combobox', { name: 'Inline actions', exact: true });
          await input.fill('Create note');
          await input.press('Enter');
          await expect(page.getByLabel('Command action count', { exact: true })).toHaveText('Actions: 1');
          await expect(page.getByLabel('Command form submissions', { exact: true })).toHaveText('Form submissions: 0');
        } else if (family === 'tree') {
          const item = page.getByRole('treeitem', { name: 'Readme', exact: true });
          await item.focus();
          await item.press('Space');
          await expect(page.getByLabel('Tree selected key', { exact: true })).toHaveText('Selected: docs-readme');
          await expect(page.getByLabel('Tree activations', { exact: true })).toHaveText('Activations: 0');
        } else if (family === 'splitter') {
          const handle = page.getByRole('separator', { name: 'Workspace sidebar', exact: true });
          await expect(handle).not.toHaveAttribute('aria-disabled', 'true');
          await handle.focus();
          await handle.press('ArrowRight');
          await expect(page.getByLabel('Splitter commit count', { exact: true })).toHaveText('Commits: 1');
          await handle.press('Enter');
          await expect(page.getByRole('button', { name: 'Sidebar action', exact: true })).not.toBeVisible();
          await expect(page.getByLabel('Splitter commit count', { exact: true })).toHaveText('Commits: 1');
        } else if (family === 'icons-extra') {
          const icon = page.getByRole('img', { name: 'Open project folder', exact: true });
          await expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
          await expect(icon).toHaveAttribute('width', '24');
          await expect(icon.locator('title')).toHaveText('Open project folder');
        } else {
          const select = page.getByRole('combobox', { name: 'Food', exact: true });
          await select.click();
          await expect(page.getByRole('listbox')).toBeVisible();
          await page.getByRole('option', { name: 'Banana', exact: true }).click();
          await expect(select).toHaveText('Banana');
          await expect(select).toBeFocused();
          await expect(page.getByRole('listbox')).toHaveCount(0);
        }
        assert.deepEqual(diagnostics, []);
        await log.write(`PASS ${family} runtime: ${engine.name()}\n`);
        console.log(`PASS ${family} runtime: ${engine.name()}`);
      } finally { await browser.close(); }
    }
  } finally {
    await new Promise<void>((done, reject) => server.httpServer.close(error => error ? reject(error) : done()));
  }
}
try {
  // Two independent installs/builds at a time; each extracted archive owns its workspace and lock.
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (cursor < selectedArchives.length) {
      const archive = selectedArchives[cursor++];
      const project = resolve(scratch, archive.replace(/\.tar\.gz$/, ''));
      const log = await open(resolve(logs, `${archive}.log`), 'w');
      try {
        await mkdir(project);
        const exec = async (command: string, args: readonly string[]) => {
          await log.write(`$ ${command} ${args.join(' ')}\n`);
          await new Promise<void>((done, reject) => {
            const child = spawn(command, [...args], { cwd: project, stdio: ['ignore', log.fd, log.fd] });
            child.once('error', reject);
            child.once('exit', code => code === 0 ? done() : reject(new Error(`${command} exited ${code}`)));
          });
        };
        await exec('tar', ['-xzf', resolve(output, archive), '-C', project]);
        // Downloaded metadata must pin the coherent tuple, exact registry packages and exact age exceptions.
        const workspace = await readFile(resolve(project, 'pnpm-workspace.yaml'), 'utf8');
        for (const name of ['solid-js', "'@solidjs/web'", "'@solidjs/signals'", "'@solidjs/compiler'", "'@solidjs/babel-plugin'"]) assert(workspace.includes(`\n  ${name}: 2.0.0-rc.15\n`), `${archive}: missing ${name} RC15 override`);
        for (const exception of [
          'solid-js@2.0.0-rc.15', '@solidjs/web@2.0.0-rc.15', '@solidjs/signals@2.0.0-rc.15',
          '@solidjs/compiler@2.0.0-rc.15', '@solidjs/babel-plugin@2.0.0-rc.15', '@solidjs/vite-plugin@3.0.0-next.50',
          '@wsagency/radix2solid-primitives@0.1.0-rc.3', '@wsagency/radix2solid-icons@0.1.0-rc.3',
          '@wsagency/radix2solid-icons-extra@0.1.0-rc.3', '@wsagency/radix2solid-themes@0.1.0-rc.3',
          '@wsagency/radix2solid-charts@0.1.0-rc.3'
        ]) assert(workspace.includes(exception), `${archive}: missing exact age exception ${exception}`);
        assert.doesNotMatch(workspace, /minimumReleaseAge:|playwright|^packages:/m, `${archive}: workspace must not relax the global age gate or carry host-only entries`);
        assert.match(workspace, /^ {2}'@wsagency\/radix2solid-primitives': "0\.1\.0-rc\.3"$/m, `${archive}: Themes' transitive Primitives dependency must be pinned to the published version`);
        const manifest: { dependencies: Record<string, string>; devDependencies: Record<string, string> } = JSON.parse(await readFile(resolve(project, 'package.json'), 'utf8'));
        assert.equal(manifest.devDependencies['@solidjs/vite-plugin'], '3.0.0-next.50', `${archive}: plugin must match the RC15 tuple`);
        const products = archive.startsWith('charts-') ? ['primitives', 'icons', 'themes', 'charts']
          : archive.startsWith('icons-extra-') ? ['primitives', 'icons', 'themes', 'icons-extra'] : ['primitives', 'icons', 'themes'];
        assert.deepEqual(Object.keys(manifest.dependencies).filter(name => name.startsWith('@wsagency/')).sort(), products.map(name => `@wsagency/radix2solid-${name}`).sort(), `${archive}: unexpected dependencies`);
        for (const name of ['solid-js', '@solidjs/web']) assert.equal(manifest.dependencies[name], '2.0.0-rc.15', `${archive}: ${name} must match the RC15 tuple`);
        for (const name of products) assert.equal(manifest.dependencies[`@wsagency/radix2solid-${name}`], '0.1.0-rc.3', `${archive}: ${name} must use the exact published version`);
        assert(!(await readdir(project)).includes('vendor'), `${archive}: sandbox must not vendor package tarballs`);
        for (const file of products.flatMap(name => name === 'charts' ? ['LICENSE-charts', 'NOTICE-charts'] : [`LICENSE-${name}`])) await readFile(resolve(project, file));
        await exec('pnpm', ['install', '--no-frozen-lockfile']);
        await exec('pnpm', ['build']);
        for (const name of products) {
          const installed = JSON.parse(await readFile(resolve(project, `node_modules/@wsagency/radix2solid-${name}/package.json`), 'utf8'));
          assert.equal(installed.version, '0.1.0-rc.3', `${archive}: installed ${name} published version`);
        }
        // The installed lock must resolve one coherent tuple and exactly one physical Primitives package.
        const lock = await readFile(resolve(project, 'pnpm-lock.yaml'), 'utf8');
        const resolved = new Set([...lock.matchAll(/^ {2}'?((?:@solidjs\/(?:web|signals|compiler|babel-plugin|vite-plugin))|solid-js)@([^(':\s]+)/gm)].map(match => `${match[1]}@${match[2]}`));
        assert.deepEqual([...resolved].sort(), ['@solidjs/babel-plugin@2.0.0-rc.15', '@solidjs/compiler@2.0.0-rc.15', '@solidjs/signals@2.0.0-rc.15', '@solidjs/vite-plugin@3.0.0-next.50', '@solidjs/web@2.0.0-rc.15', 'solid-js@2.0.0-rc.15'], `${archive}: incoherent Solid tuple`);
        assert(lock.includes('@wsagency/radix2solid-primitives@0.1.0-rc.3'), `${archive}: lockfile must contain the exact Primitives registry release`);
        const rootRequire = createRequire(resolve(project, 'package.json'));
        const themesRequire = createRequire(resolve(project, 'node_modules/@wsagency/radix2solid-themes/package.json'));
        assert.equal(await realpath(rootRequire.resolve('@wsagency/radix2solid-primitives')), await realpath(themesRequire.resolve('@wsagency/radix2solid-primitives')), `${archive}: Themes must resolve the same published Primitives package`);
        console.log(`PASS ${archive}: isolated registry install, coherent RC15 tuple and build`);
        const family = representatives[archive];
        if (family) await checkRuntime(project, family, log);
      } catch (error) {
        await log.write(`${error instanceof Error ? error.stack : String(error)}\n`);
        failures.push(`${archive}: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`FAIL ${archive}; raw log: ${resolve(logs, `${archive}.log`)}`);
      } finally { await log.close(); }
    }
  }));
} finally { await rm(scratch, { recursive: true, force: true }); }
assert.deepEqual(failures, [], `Archive consumer failures; raw logs: ${logs}`);
console.log(`${selectedArchives.length}/${archives.length} real archives independently installed and built; runtime interactions: ${selectedArchives.filter(archive => representatives[archive]).length} representative archives × 3 engines. Raw logs: ${logs}.`);
