import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, open, readFile, readdir, rm, type FileHandle } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { preview } from 'vite';

const site = resolve(import.meta.dirname, '..');
const output = resolve(site, 'out/sandboxes');
const coverage: { sandboxes: string[] } = JSON.parse(await readFile(resolve(site, 'coverage-manifest.json'), 'utf8'));
const archives = (await readdir(output)).filter(name => name.endsWith('.tar.gz')).sort();
assert.equal(archives.length, 95, 'All 95 advertised archives must be exercised.');
assert.deepEqual(archives, [...coverage.sandboxes].sort());
const scratch = await mkdtemp(resolve(tmpdir(), 'radix2solid-sandboxes-'));
const logRoot = resolve(site, '../../.artifacts/sandboxes');
await mkdir(logRoot, { recursive: true });
const logs = await mkdtemp(resolve(logRoot, 'run-'));
const failures: string[] = [];
let cursor = 0;
const representatives: Record<string, 'dialog' | 'toast' | 'select' | 'charts'> = {
  'dialog-css.tar.gz': 'dialog',
  'toast-css-modules.tar.gz': 'toast',
  'select-tailwind.tar.gz': 'select',
  'charts-css-modules.tar.gz': 'charts'
};
async function checkRuntime(project: string, family: 'dialog' | 'toast' | 'select' | 'charts', log: FileHandle) {
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
    while (cursor < archives.length) {
      const archive = archives[cursor++];
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
        // Downloaded metadata alone must pin the coherent tuple: exact RC15 overrides, matching
        // plugin, exact (non-global) age exceptions and the real bundled tarball names.
        const workspace = await readFile(resolve(project, 'pnpm-workspace.yaml'), 'utf8');
        for (const name of ['solid-js', "'@solidjs/web'", "'@solidjs/signals'", "'@solidjs/compiler'", "'@solidjs/babel-plugin'"]) assert(workspace.includes(`\n  ${name}: 2.0.0-rc.15\n`), `${archive}: missing ${name} RC15 override`);
        for (const exception of ['solid-js@2.0.0-rc.15', '@solidjs/web@2.0.0-rc.15', '@solidjs/signals@2.0.0-rc.15', '@solidjs/compiler@2.0.0-rc.15', '@solidjs/babel-plugin@2.0.0-rc.15', '@solidjs/vite-plugin@3.0.0-next.50']) assert(workspace.includes(exception), `${archive}: missing exact age exception ${exception}`);
        assert.doesNotMatch(workspace, /minimumReleaseAge:|playwright|^packages:/m, `${archive}: workspace must not relax the global age gate or carry host-only entries`);
        const manifest: { dependencies: Record<string, string>; devDependencies: Record<string, string> } = JSON.parse(await readFile(resolve(project, 'package.json'), 'utf8'));
        assert.equal(manifest.devDependencies['@solidjs/vite-plugin'], '3.0.0-next.50', `${archive}: plugin must match the RC15 tuple`);
        const products = archive.startsWith('charts-') ? ['primitives', 'icons', 'themes', 'charts'] : ['primitives', 'icons', 'themes'];
        assert.deepEqual(Object.keys(manifest.dependencies).filter(name => name.startsWith('@wsagency/')).sort(), products.map(name => `@wsagency/radix2solid-${name}`).sort(), `${archive}: unexpected dependencies`);
        for (const name of ['solid-js', '@solidjs/web']) assert.equal(manifest.dependencies[name], '2.0.0-rc.15', `${archive}: ${name} must match the RC15 tuple`);
        for (const name of products) {
          const spec = manifest.dependencies[`@wsagency/radix2solid-${name}`];
          assert.match(spec, new RegExp(`^file:\\./vendor/wsagency-radix2solid-${name}-0\\.1\\.0-rc\\.2\\.tgz$`), `${archive}: ${name} tarball name`);
          await readFile(resolve(project, spec.slice('file:'.length)));
        }
        for (const file of products.flatMap(name => name === 'charts' ? ['LICENSE-charts', 'NOTICE-charts'] : [`LICENSE-${name}`])) await readFile(resolve(project, file));
        assert.match(workspace, /^ {2}'@wsagency\/radix2solid-primitives': "file:\.\/vendor\/wsagency-radix2solid-primitives-0\.1\.0-rc\.2\.tgz"$/m, `${archive}: themes' transitive primitives must be overridden to the bundled tarball`);
        await exec('pnpm', ['install', '--no-frozen-lockfile']);
        await exec('pnpm', ['build']);
        // The installed lock must resolve one coherent tuple and the local primitives tarball.
        const lock = await readFile(resolve(project, 'pnpm-lock.yaml'), 'utf8');
        const resolved = new Set([...lock.matchAll(/^ {2}'?((?:@solidjs\/(?:web|signals|compiler|babel-plugin|vite-plugin))|solid-js)@([^(':\s]+)/gm)].map(match => `${match[1]}@${match[2]}`));
        assert.deepEqual([...resolved].sort(), ['@solidjs/babel-plugin@2.0.0-rc.15', '@solidjs/compiler@2.0.0-rc.15', '@solidjs/signals@2.0.0-rc.15', '@solidjs/vite-plugin@3.0.0-next.50', '@solidjs/web@2.0.0-rc.15', 'solid-js@2.0.0-rc.15'], `${archive}: incoherent Solid tuple`);
        assert.match(lock, /'@wsagency\/radix2solid-primitives': file:(?:\.\/)?vendor\/wsagency-radix2solid-primitives-[^\s]+\.tgz/, `${archive}: themes must resolve primitives from the bundled tarball`);
        console.log(`PASS ${archive}: isolated install, coherent RC15 tuple and build`);
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
console.log(`All ${archives.length} real archives independently installed and built; runtime interactions: ${Object.keys(representatives).length} representative families × 3 engines. Raw logs: ${logs}.`);
