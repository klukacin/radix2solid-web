import { spawnSync } from 'node:child_process';
import { lstat, mkdir, readFile, realpath, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const target = resolve(root, '.library');
const repository = 'https://github.com/klukacin/radix2solid.git';
const pin: unknown = JSON.parse(await readFile(resolve(root, 'library-source.json'), 'utf8'));
if (!pin || typeof pin !== 'object' || !('repository' in pin) || pin.repository !== repository ||
    !('commit' in pin) || typeof pin.commit !== 'string' || !/^[0-9a-f]{40}$/.test(pin.commit) ||
    !('provenance' in pin) || pin.provenance !== 'c08948ae4b4faafed174f70cc65886d864e0c07c') {
  throw new Error('Invalid library pin: require the fixed public repository, full commit and source provenance.');
}
// Capture once: file replacement cannot change the commit used by this invocation.
const commit = pin.commit;
function git(...args: string[]) {
  const result = spawnSync('git', ['-C', target, ...args], { encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Library Git checkout: ${result.stderr.trim()}`);
  return result.stdout.trim();
}
async function validate() {
  if (await realpath(git('rev-parse', '--show-toplevel')) !== await realpath(target)) {
    throw new Error('.library must be its own real Git checkout.');
  }
  if (git('rev-parse', 'HEAD') !== commit) throw new Error(`Library HEAD differs from pinned ${commit}; existing checkout was not changed.`);
  if (git('status', '--porcelain=v1', '--untracked-files=all')) throw new Error('Library checkout is dirty; existing data was not changed.');
}

let existing;
try { existing = await lstat(target); }
catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
if (existing) {
  if (existing.isSymbolicLink()) throw new Error('.library must not be a symlink.');
  if (!existing.isDirectory()) throw new Error('.library must be a real Git checkout directory.');
  await validate();
} else {
  // Exclusive creation: never overwrite a target another process created meanwhile.
  await mkdir(target);
  const owned = await lstat(target);
  try {
    git('init');
    git('remote', 'add', 'origin', repository);
    git('fetch', '--depth=1', 'origin', commit);
    git('checkout', '--detach', 'FETCH_HEAD');
    await validate();
  } catch (error) {
    const current = await lstat(target).catch(() => undefined);
    if (current?.dev === owned.dev && current.ino === owned.ino) await rm(target, { recursive: true, force: true });
    throw error;
  }
}
console.log(`Library checkout validated at ${commit}.`);
