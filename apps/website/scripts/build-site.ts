import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'out');
const manifest = JSON.parse(await readFile(resolve(root, 'dist/client/.vite/manifest.json'), 'utf8'));
const entry = manifest['src/entry-client.tsx'];
function stylesheets(key: string, visited = new Set<string>()): string[] {
  if (visited.has(key) || !manifest[key]) return [];
  visited.add(key);
  return [...(manifest[key].css ?? []), ...(manifest[key].imports ?? []).flatMap((dependency: string) => stylesheets(dependency, visited))];
}
const { renderPage, routePaths, routeManifestKeys } = await import(new URL('../dist/server/entry-server.js', import.meta.url).href) as typeof import('../src/entry-server.js');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, 'dist/client'), output, { recursive: true, filter: source => !source.split(/[\\/]/).some(part => part.startsWith('.')) });
for (const path of [...routePaths, '/404']) {
  const file = resolve(output, `${path.slice(1) || 'index'}.html`);
  await mkdir(dirname(file), { recursive: true });
  const css = [...new Set([...stylesheets('src/entry-client.tsx'), ...stylesheets(routeManifestKeys[path])])];
  await writeFile(file, await renderPage(path, `/${entry.file}`, css.map(file => `/${file}`)));
}
console.log(`Rendered ${routePaths.length} native static routes and the 404 page.`);
