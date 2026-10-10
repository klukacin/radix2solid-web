import { createHash } from 'node:crypto';
import { existsSync, globSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { select, selectAll } from 'hast-util-select';
import { resolveRedirect } from '../worker/redirects.ts';
import type { SearchRecord } from './build-search-index.ts';

const output = resolve(import.meta.dirname, '../out');
const { routePaths } = await import(new URL('../dist/server/entry-server.js', import.meta.url).href) as typeof import('../src/entry-server.js');
const pageFile = (path: string) => `${path.replace(/^\//, '').replace(/\/+$/, '') || 'index'}.html`;
const expected = new Set([...routePaths, '/404'].map(pageFile));
const files = globSync('**/*.html', { cwd: output });
const errors = new Set<string>();
const ids = new Map<string, Set<string>>();
const coverage: { website: { documents: string[]; demos: string[]; routes: string[] }; upstreamRoutes: string[]; sandboxes: string[] } =
  JSON.parse(readFileSync(resolve(import.meta.dirname, '../coverage-manifest.json'), 'utf8'));
const actualDocuments = globSync('**/*.mdx', { cwd: resolve(import.meta.dirname, '../data') });
const actualDemos = globSync('**/*.{tsx,css,cjs}', { cwd: resolve(import.meta.dirname, '../src/demos') });
for (const [kind, actual, count] of [['documents', actualDocuments.length, 137], ['demo sources', actualDemos.length, 215], ['routes', routePaths.length, 151]] as const) {
  if (actual !== count) errors.add(`expected ${count} ${kind}, found ${actual}`);
}
const archives = new Set(globSync('*.tar.gz', { cwd: resolve(output, 'sandboxes') }));
if (archives.size !== 92) errors.add(`expected 92 runnable archives, found ${archives.size}`);
for (const name of coverage.sandboxes) if (!archives.has(name)) errors.add(`missing normative sandbox: ${name}`);
for (const name of archives) if (!coverage.sandboxes.includes(name)) errors.add(`unmapped sandbox: ${name}`);
for (const [kind, actual, required] of [
  ['route', routePaths, coverage.website.routes],
  ['document', actualDocuments, coverage.website.documents],
  ['demo source', actualDemos, coverage.website.demos],
] as const) {
  const actualPaths = new Set(actual), requiredPaths = new Set(required);
  for (const path of requiredPaths) if (!actualPaths.has(path)) errors.add(`missing normative ${kind}: ${path}`);
  for (const path of actualPaths) if (!requiredPaths.has(path)) errors.add(`unmapped ${kind}: ${path}`);
}
// Original routes were independently observed at the committed provenance in coverage-manifest.json.
const upstreamRoutes = new Set(coverage.upstreamRoutes);
for (const path of upstreamRoutes) if (!routePaths.includes(path)) errors.add(`missing upstream route: ${path}`);
for (const path of routePaths) if (!upstreamRoutes.has(path)) errors.add(`unexpected native route: ${path}`);
const markdownFiles = new Set([...expected].filter(file => file !== '404.html').map(file => file.replace(/\.html$/, '.md')));
const publicFiles = new Set(['_headers', 'search-index.json', 'NOTICE.txt', 'WEBSITE-LICENSE.txt', 'favicon.png', 'favicon-black.svg', 'favicon-white.svg', 'packages/radix-solid-icons-0.0.0-local.tgz', 'packages/radix-solid-primitives-0.0.0-local.tgz', 'packages/radix-solid-themes-0.0.0-local.tgz']);
const assetDirectories = new Set(['assets', 'fonts', 'icons', 'social', 'marketing', 'sandboxes']);
for (const file of readdirSync(output, { recursive: true }) as string[]) {
  if (statSync(resolve(output, file)).isFile() && !expected.has(file) && !markdownFiles.has(file) && !publicFiles.has(file) && !assetDirectories.has(file.split('/')[0])) errors.add(`unregistered public artifact: out/${file}`);
  if (file.split('/').some(segment => segment.startsWith('.')) || /(?:^|\/)runtime-graph\.json$|\.map$/.test(file)) errors.add(`private build artifact: out/${file}`);
  if (/\.(?:html|md|json|js|css|txt)$/.test(file) && statSync(resolve(output, file)).isFile() && /\/(?:home|Users)\/[^/\s]+\/|file:\/\/\/|[A-Z]:\\Users\\/.test(readFileSync(resolve(output, file), 'utf8'))) errors.add(`local filesystem path: out/${file}`);
}
const fontManifest: { license: { file: string; sha256: string }; fonts: { file: string; sha256: string }[] } =
  JSON.parse(readFileSync(resolve(import.meta.dirname, '../public/fonts/manifest.json'), 'utf8'));
const fontFiles = new Set(fontManifest.fonts.map(font => font.file));
for (const directory of [resolve(import.meta.dirname, '../public/fonts'), resolve(output, 'fonts')]) {
  for (const file of globSync('**/*.{woff,woff2,ttf,otf}', { cwd: directory })) {
    if (!fontFiles.has(file)) errors.add(`unlicensed font asset: ${directory}/${file}`);
  }
  for (const asset of [...fontManifest.fonts, fontManifest.license]) {
    const path = resolve(directory, asset.file);
    if (!existsSync(path)) { errors.add(`missing licensed font asset: ${path}`); continue; }
    const bytes = readFileSync(path);
    if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) errors.add(`font provenance mismatch: ${path}`);
    if (fontFiles.has(asset.file) && bytes.toString('ascii', 0, 4) !== 'wOF2') errors.add(`invalid WOFF2 asset: ${path}`);
  }
  if (!existsSync(resolve(directory, 'manifest.json'))) errors.add(`missing font provenance manifest: ${directory}`);
}
const links: { source: string; url: string }[] = [];
const parser = unified().use(rehypeParse);
const origin = 'https://export.invalid';

for (const file of [...expected, '_headers', 'search-index.json']) {
  if (!existsSync(resolve(output, file))) errors.add(`missing out/${file}`);
}
if (existsSync(resolve(output, '_redirects'))) errors.add('out/_redirects exists; redirects belong in worker/redirects.ts');
for (const file of files) {
  if (!expected.has(file)) errors.add(`unregistered page out/${file}`);
  if (file !== '404.html' && !existsSync(resolve(output, file.replace(/\.html$/, '.md')))) errors.add(`missing Markdown twin out/${file}`);
  const tree = parser.parse(readFileSync(resolve(output, file), 'utf8'));
  ids.set(file, new Set(selectAll('[id]', tree).map(node => String(node.properties.id))));
  const robots = select('meta[name="robots"]', tree);
  if (!String(robots?.properties.content).split(/[\s,]+/).includes('noindex')) errors.add(`${file}: preview is not noindex`);
  for (const node of selectAll('[href], [src]', tree)) {
    for (const property of ['href', 'src']) {
      const url = node.properties[property];
      if (typeof url === 'string') links.push({ source: file, url });
    }
  }
}
if (existsSync(resolve(output, 'search-index.json'))) {
  const records: SearchRecord[] = JSON.parse(readFileSync(resolve(output, 'search-index.json'), 'utf8'));
  for (const record of records) links.push({ source: `search-index.json:${record.objectID}`, url: record.url });
}
for (const { source, url: value } of links) {
  try {
    const sourcePath = source.split(':')[0];
    let url = new URL(value, new URL(sourcePath === 'index.html' ? '' : sourcePath.replace(/\.html$/, ''), `${origin}/`));
    if (/google-analytics\.com|googletagmanager\.com|plausible\.io|vercel-scripts\.com|vercel\.live/.test(url.hostname)) {
      errors.add(`${source}: upstream analytics/preview dependency ${value}`);
    }
    if (url.origin !== origin) continue;
    const visited = new Set<string>();
    for (;;) {
      if (visited.has(url.pathname)) throw new Error('redirect loop');
      visited.add(url.pathname);
      const redirect = resolveRedirect(url);
      if (!redirect) break;
      const hash = url.hash;
      url = new URL(redirect.location, url);
      url.hash ||= hash;
    }
    const path = decodeURIComponent(url.pathname).replace(/^\//, '');
    const candidate = pageFile(`/${path}`);
    const file = expected.has(candidate) ? candidate : path;
    const target = resolve(output, file);
    if (!target.startsWith(`${output}/`) || !existsSync(target) || !statSync(target).isFile()) {
      errors.add(`${source}: missing target ${value} (out/${file})`);
    } else if (url.hash && !url.hash.startsWith('#:~:text=') && ids.has(file) && !ids.get(file)!.has(decodeURIComponent(url.hash.slice(1)))) {
      errors.add(`${source}: missing anchor ${value} (out/${file})`);
    }
  } catch (error) {
    errors.add(`${source}: invalid URL ${value}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (errors.size) {
  console.error('Static export check failed:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Static export check passed (${routePaths.length} registered routes + 404, ${links.length} page/asset/search references, Markdown twins and noindex).`);
}
