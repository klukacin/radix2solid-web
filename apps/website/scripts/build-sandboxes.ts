import { cp, glob, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';

const site = resolve(import.meta.dirname, '..');
const root = resolve(site, '../..');
const library = resolve(root, '.library');
const staging = resolve(site, 'dist/sandboxes');
const vendor = resolve(staging, 'vendor');
const output = resolve(site, 'out/sandboxes');
await rm(staging, { recursive: true, force: true });
await mkdir(vendor, { recursive: true });
await mkdir(output, { recursive: true });
function run(command: string, args: string[], cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited ${result.status}`);
}
const dependencies: Record<string, string> = { 'solid-js': '2.0.0-rc.13', '@solidjs/web': '2.0.0-rc.13', '@radix-ui/colors': '3.0.0' };
for (const name of ['primitives', 'icons', 'themes']) {
  run('pnpm', ['--dir', resolve(library, `packages/${name}`), 'pack', '--pack-destination', vendor]);
  dependencies[`@radix-solid/${name}`] = `file:./vendor/radix-solid-${name}-0.0.0-local.tgz`;
}
await cp(vendor, resolve(site, 'out/packages'), { recursive: true });
const workspace = (await readFile(resolve(root, 'pnpm-workspace.yaml'), 'utf8'))
  .replace('overrides:\n', `overrides:\n  '@radix-solid/primitives': ${JSON.stringify(dependencies['@radix-solid/primitives'])}\n`)
  .replace('minimumReleaseAgeExclude:\n', "minimumReleaseAgeExclude:\n  - '@radix-solid/primitives@0.0.0-local'\n  - '@radix-solid/icons@0.0.0-local'\n  - '@radix-solid/themes@0.0.0-local'\n");
const globalCss = 'body{margin:0;font-family:system-ui}.radix-themes{min-height:100vh;display:grid;place-items:center;background:linear-gradient(140deg,var(--violet-9),var(--purple-9))}';
let count = 0;
for await (const entry of glob('*/index.tsx', { cwd: resolve(site, 'src/demos') })) {
  const name = dirname(entry);
  for (const solution of ['css-modules', 'css', 'tailwind']) {
    const source = resolve(site, `src/demos/${name}${solution === 'css-modules' ? '' : `/${solution}`}`);
    try { await readFile(resolve(source, 'index.tsx')); } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT' && name === 'getting-started' && solution === 'tailwind') continue;
      throw error;
    }
    const project = resolve(staging, `${name}-${solution}`);
    await mkdir(project, { recursive: true });
    await cp(vendor, resolve(project, 'vendor'), { recursive: true });
    for await (const file of glob('*.{tsx,css,cjs}', { cwd: source })) {
      let content = await readFile(resolve(source, file), 'utf8');
      if (solution === 'tailwind' && file === 'styles.css') content = content.replace('./index.tsx', './demo.tsx');
      await writeFile(resolve(project, file === 'index.tsx' ? 'demo.tsx' : basename(file)), content);
    }
    await writeFile(resolve(project, 'package.json'), JSON.stringify({ name: `radix-solid-${name}-${solution}-demo`, private: true, type: 'module', packageManager: 'pnpm@11.5.0', engines: { node: '>=24 <25' }, scripts: { dev: 'vite', build: 'vite build' }, dependencies, devDependencies: { '@solidjs/vite-plugin': '3.0.0-next.35', vite: '8.3.3', ...(solution === 'tailwind' ? { tailwindcss: '4.3.3', '@tailwindcss/vite': '4.3.3' } : {}) } }, null, 2));
    await writeFile(resolve(project, 'pnpm-workspace.yaml'), workspace);
    await writeFile(resolve(project, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Radix2Solid native demo</title></head><body><div id="root"></div><script type="module" src="/entry.tsx"></script></body></html>');
    await writeFile(resolve(project, 'vite.config.ts'), `import { defineConfig } from 'vite';\nimport solid from '@solidjs/vite-plugin';\n${solution === 'tailwind' ? "import tailwindcss from '@tailwindcss/vite';\n" : ''}export default defineConfig({ plugins: [solid()${solution === 'tailwind' ? ', tailwindcss()' : ''}], resolve: { dedupe: ['solid-js', '@solidjs/web', '@solidjs/signals'] } });\n`);
    await writeFile(resolve(project, 'entry.tsx'), `import { render } from '@solidjs/web';\nimport { Theme } from '@radix-solid/themes';\nimport '@radix-solid/themes/styles.css';\n${solution === 'tailwind' ? "import './styles.css';\n" : ''}import Demo from './demo.tsx';\nimport './global.css';\nrender(() => <Theme accentColor="indigo"><Demo /></Theme>, document.getElementById('root')!);\n`);
    await writeFile(resolve(project, 'global.css'), globalCss);
    for (const name of ['primitives', 'icons', 'themes']) await cp(resolve(library, `packages/${name}/LICENSE`), resolve(project, `LICENSE-${name}`));
    run('tar', ['-czf', resolve(output, `${name}-${solution}.tar.gz`), '-C', project, '.']);
    count++;
  }
}
console.log(`Built ${count} runnable native sandboxes with pinned Solid 2 and real package tarballs.`);
