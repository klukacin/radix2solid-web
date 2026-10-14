import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFile, lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test, { type TestContext } from 'node:test';

const root = resolve(import.meta.dirname, '..');
const pin = JSON.parse(await readFile(resolve(root, 'library-source.json'), 'utf8')) as { repository: string; commit: string; provenance: string };
function git(cwd: string, ...args: string[]) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
const identity = git(resolve(root, '.library'), 'show', '-s', '--format=%an%n%ae%n%cn%n%ce', pin.commit).split('\n');

async function fixture(t: TestContext) {
  const scratch = await mkdtemp(resolve(tmpdir(), 'radix2solid-bootstrap-'));
  t.after(() => rm(scratch, { recursive: true, force: true }));
  const web = resolve(scratch, 'web');
  git(scratch, 'clone', '--no-hardlinks', root, web);
  await writeFile(resolve(web, 'library-source.json'), JSON.stringify(pin));
  await mkdir(resolve(web, 'scripts'), { recursive: true });
  try { await copyFile(resolve(root, 'scripts/prepare-library.ts'), resolve(web, 'scripts/prepare-library.ts')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  const library = resolve(web, '.library');
  git(web, 'clone', '--no-hardlinks', resolve(root, '.library'), library);
  git(library, 'checkout', '--detach', pin.commit);
  return { web, library, scratch };
}
// Strict default: never inherit a developer's local source opt-in.
const { RADIX2SOLID_LIBRARY_SOURCE: _inherited, ...strictEnv } = process.env;
function bootstrap(web: string, cwd = web, source?: string) {
  return spawnSync(process.execPath, [resolve(web, 'scripts/prepare-library.ts')], { cwd, encoding: 'utf8', env: source === undefined ? strictEnv : { ...strictEnv, RADIX2SOLID_LIBRARY_SOURCE: source } });
}
function rejected(web: string, reason: RegExp, source?: string) {
  const result = bootstrap(web, web, source);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, reason);
}
// A local-only native commit, as the developer preview bridge sees an unpublished native branch.
async function localCommit(scratch: string) {
  const source = resolve(scratch, 'native-source');
  git(scratch, 'clone', '--no-hardlinks', resolve(root, '.library'), source);
  const result = spawnSync('git', ['commit', '--allow-empty', '-m', 'Scratch-only local native commit'], { cwd: source, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: identity[0], GIT_AUTHOR_EMAIL: identity[1], GIT_COMMITTER_NAME: identity[2], GIT_COMMITTER_EMAIL: identity[3] } });
  assert.equal(result.status, 0, result.stderr);
  return { source, commit: git(source, 'rev-parse', 'HEAD') };
}

test('a real pinned checkout accepts repeated bootstrap from unrelated working directories and ignores build outputs', async t => {
  const { web, library, scratch } = await fixture(t);
  for (const directory of ['node_modules', 'packages/primitives/dist']) {
    await mkdir(resolve(library, directory), { recursive: true });
    await writeFile(resolve(library, directory, 'retained.txt'), 'ignored consumer output');
  }
  for (let repeat = 0; repeat < 2; repeat++) {
    const result = bootstrap(web, scratch);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
  }
  assert.equal(await readFile(resolve(library, 'node_modules/retained.txt'), 'utf8'), 'ignored consumer output');
});

for (const state of ['unstaged', 'staged', 'untracked'] as const) {
  test(`bootstrap rejects ${state} real Git changes without changing checkout data`, async t => {
    const { web, library } = await fixture(t);
    const file = state === 'untracked' ? 'consumer-data.txt' : 'package.json';
    const content = state === 'untracked' ? 'keep this user file' : `${await readFile(resolve(library, file), 'utf8')}\n`;
    await writeFile(resolve(library, file), content);
    if (state === 'staged') git(library, 'add', file);
    const status = git(library, 'status', '--porcelain');
    rejected(web, /dirty/i);
    assert.equal(git(library, 'status', '--porcelain'), status);
    assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
    assert.equal(await readFile(resolve(library, file), 'utf8'), content);
  });
}

test('bootstrap rejects a different real clean HEAD without resetting it', async t => {
  const { web, library } = await fixture(t);
  const result = spawnSync('git', ['commit', '--allow-empty', '-m', 'Scratch-only alternate commit'], { cwd: library, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: identity[0], GIT_AUTHOR_EMAIL: identity[1], GIT_COMMITTER_NAME: identity[2], GIT_COMMITTER_EMAIL: identity[3] } });
  assert.equal(result.status, 0, result.stderr);
  const other = git(library, 'rev-parse', 'HEAD');
  rejected(web, /HEAD/i);
  assert.equal(git(library, 'rev-parse', 'HEAD'), other);
  assert.equal(git(library, 'status', '--porcelain'), '');
});

for (const change of [{ commit: 'main' }, { commit: '0000000000000000000000000000000000000000' }, { repository: 'https://github.com/radix-ui/primitives.git' }]) {
  test(`bootstrap rejects a malformed or replaced pin ${JSON.stringify(change)} without touching checkout`, async t => {
    const { web, library } = await fixture(t);
    await writeFile(resolve(web, 'library-source.json'), JSON.stringify({ ...pin, ...change }));
    rejected(web, /pin|HEAD|repository/i);
    assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
    assert.equal(git(library, 'status', '--porcelain'), '');
    assert.deepEqual(JSON.parse(await readFile(resolve(web, 'library-source.json'), 'utf8')), { ...pin, ...change });
  });
}

test('bootstrap rejects a symlink without touching its real checkout', async t => {
  const { web, library, scratch } = await fixture(t);
  const linked = resolve(scratch, 'linked-web');
  git(scratch, 'clone', '--no-hardlinks', root, linked);
  await writeFile(resolve(linked, 'library-source.json'), JSON.stringify(pin));
  await mkdir(resolve(linked, 'scripts'), { recursive: true });
  try { await copyFile(resolve(root, 'scripts/prepare-library.ts'), resolve(linked, 'scripts/prepare-library.ts')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  await symlink(library, resolve(linked, '.library'));
  rejected(linked, /symlink/i);
  assert.equal((await lstat(resolve(linked, '.library'))).isSymbolicLink(), true);
  assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
  assert.equal(git(library, 'status', '--porcelain'), '');
});

test('bootstrap rejects an existing non-Git directory and preserves its user data', async t => {
  const { web, library } = await fixture(t);
  await rm(library, { recursive: true });
  await mkdir(library);
  await writeFile(resolve(library, 'consumer-data.txt'), 'do not overwrite');
  rejected(web, /Git checkout/i);
  assert.equal(await readFile(resolve(library, 'consumer-data.txt'), 'utf8'), 'do not overwrite');
});

test('explicit local source advances a clean checkout to a local-only pin and keeps origin and ignored outputs', async t => {
  const { web, library, scratch } = await fixture(t);
  const { source, commit } = await localCommit(scratch);
  await writeFile(resolve(web, 'library-source.json'), JSON.stringify({ ...pin, commit }));
  await mkdir(resolve(library, 'node_modules'), { recursive: true });
  await writeFile(resolve(library, 'node_modules/retained.txt'), 'ignored consumer output');
  const origin = git(library, 'remote', 'get-url', 'origin');
  rejected(web, /HEAD/i);
  assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
  const result = bootstrap(web, scratch, source);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Developer preview.*not proof of public availability/);
  assert.equal(git(library, 'rev-parse', 'HEAD'), commit);
  assert.equal(git(library, 'status', '--porcelain'), '');
  assert.equal(git(library, 'remote', 'get-url', 'origin'), origin);
  assert.equal(await readFile(resolve(library, 'node_modules/retained.txt'), 'utf8'), 'ignored consumer output');
});

test('explicit local source creates a missing checkout whose origin remains the public repository', async t => {
  const { web, library, scratch } = await fixture(t);
  const { source, commit } = await localCommit(scratch);
  await writeFile(resolve(web, 'library-source.json'), JSON.stringify({ ...pin, commit }));
  await rm(library, { recursive: true });
  const result = bootstrap(web, web, source);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(git(library, 'rev-parse', 'HEAD'), commit);
  assert.equal(git(library, 'remote', 'get-url', 'origin'), pin.repository);
});

test('explicit local source still rejects a dirty checkout before fetching', async t => {
  const { web, library, scratch } = await fixture(t);
  const { source, commit } = await localCommit(scratch);
  await writeFile(resolve(web, 'library-source.json'), JSON.stringify({ ...pin, commit }));
  await writeFile(resolve(library, 'consumer-data.txt'), 'keep this user file');
  rejected(web, /dirty/i, source);
  assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
  assert.equal(await readFile(resolve(library, 'consumer-data.txt'), 'utf8'), 'keep this user file');
  assert.throws(() => git(library, 'cat-file', '-e', commit));
});

test('explicit local source fails without a fallback when it lacks the pinned commit', async t => {
  const { web, library, scratch } = await fixture(t);
  const { commit } = await localCommit(scratch);
  await writeFile(resolve(web, 'library-source.json'), JSON.stringify({ ...pin, commit }));
  rejected(web, /Library Git checkout/, resolve(root, '.library'));
  assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
  assert.equal(git(library, 'status', '--porcelain'), '');
});

for (const [label, path, reason] of [['relative', 'native-source', /absolute/], ['nested', 'native-source/packages', /top level/], ['remote URL', 'https://github.com/wsagency/radix2solid.git', /absolute/]] as const) {
  test(`explicit local source rejects a ${label} path without touching checkout`, async t => {
    const { web, library, scratch } = await fixture(t);
    const { source, commit } = await localCommit(scratch);
    await writeFile(resolve(web, 'library-source.json'), JSON.stringify({ ...pin, commit }));
    rejected(web, reason, path.startsWith('native-source/') ? resolve(source, 'packages') : path);
    assert.equal(git(library, 'rev-parse', 'HEAD'), pin.commit);
    assert.equal(git(library, 'status', '--porcelain'), '');
  });
}
