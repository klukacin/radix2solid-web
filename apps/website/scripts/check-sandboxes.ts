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
assert.equal(archives.length, 92, 'All 92 advertised archives must be exercised.');
assert.deepEqual(archives, [...coverage.sandboxes].sort());
const scratch = await mkdtemp(resolve(tmpdir(), 'radix2solid-sandboxes-'));
const logRoot = resolve(site, '../../.artifacts/sandboxes');
await mkdir(logRoot, { recursive: true });
const logs = await mkdtemp(resolve(logRoot, 'run-'));
const failures: string[] = [];
let cursor = 0;
const representatives: Record<string, 'dialog' | 'toast' | 'select'> = {
  'dialog-css.tar.gz': 'dialog',
  'toast-css-modules.tar.gz': 'toast',
  'select-tailwind.tar.gz': 'select'
};
async function checkRuntime(project: string, family: 'dialog' | 'toast' | 'select', log: FileHandle) {
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
        for (const [command, args] of [
          ['tar', ['-xzf', resolve(output, archive), '-C', project]],
          ['pnpm', ['install', '--no-frozen-lockfile']],
          ['pnpm', ['build']]
        ] as const) {
          await log.write(`$ ${command} ${args.join(' ')}\n`);
          await new Promise<void>((done, reject) => {
            const child = spawn(command, [...args], { cwd: project, stdio: ['ignore', log.fd, log.fd] });
            child.once('error', reject);
            child.once('exit', code => code === 0 ? done() : reject(new Error(`${command} exited ${code}`)));
          });
        }
        console.log(`PASS ${archive}: isolated install and build`);
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
console.log(`All ${archives.length} real archives independently installed and built; runtime interactions: 3 representative families × 3 engines (9 scenes). Raw logs: ${logs}.`);
