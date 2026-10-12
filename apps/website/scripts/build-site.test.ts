import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, symlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

// Runs after `pnpm build`: exports the real dist from a checkout whose path has a hidden ancestor directory.
test('static export of the real dist keeps its CSS and entry JS when the checkout lives under a hidden directory', async t => {
  const checkout = resolve(await mkdtemp(resolve(tmpdir(), '.hidden-ancestor-')), 'website');
  t.after(() => rm(resolve(checkout, '..'), { recursive: true, force: true }));
  await mkdir(resolve(checkout, 'scripts'), { recursive: true });
  await copyFile(resolve(import.meta.dirname, 'build-site.ts'), resolve(checkout, 'scripts/build-site.ts'));
  await symlink(resolve(import.meta.dirname, '../dist'), resolve(checkout, 'dist'), 'dir');

  const build = spawnSync(process.execPath, [resolve(checkout, 'scripts/build-site.ts')], { cwd: checkout, encoding: 'utf8', maxBuffer: 1 << 26 });
  assert.equal(build.status, 0, build.stderr);

  const out = resolve(checkout, 'out');
  const html = await readFile(resolve(out, 'index.html'), 'utf8');
  const assets = [...html.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)].map(match => match[1]);
  assert.ok(assets.some(asset => asset.endsWith('.css')), 'index.html links a stylesheet');
  assert.ok(assets.some(asset => asset.endsWith('.js')), 'index.html loads the entry script');
  for (const asset of assets) assert.ok((await stat(resolve(out, `.${asset}`))).isFile(), `${asset} was exported as a regular file`);
  assert.equal(existsSync(resolve(out, '.vite')), false, 'hidden Vite metadata is not exported');
});
