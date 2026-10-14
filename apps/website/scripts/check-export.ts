import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, globSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
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
const coverage: { website: { documents: string[]; demos: string[]; routes: string[] }; upstreamRoutes: string[]; nativeRoutes: string[]; sandboxes: string[] } =
  JSON.parse(readFileSync(resolve(import.meta.dirname, '../coverage-manifest.json'), 'utf8'));
const actualDocuments = globSync('**/*.mdx', { cwd: resolve(import.meta.dirname, '../data') });
const actualDemos = globSync('**/*.{tsx,css,cjs}', { cwd: resolve(import.meta.dirname, '../src/demos') });
const archives = new Set(globSync('*.tar.gz', { cwd: resolve(output, 'sandboxes') }));
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
// Native-only additions (Charts, Themes recipes) are declared separately and never claimed as upstream.
const upstreamRoutes = new Set(coverage.upstreamRoutes), nativeRoutes = new Set(coverage.nativeRoutes);
for (const path of upstreamRoutes) if (!routePaths.includes(path)) errors.add(`missing upstream route: ${path}`);
for (const path of nativeRoutes) if (upstreamRoutes.has(path) || !routePaths.includes(path)) errors.add(`invalid native route: ${path}`);
for (const path of routePaths) if (!upstreamRoutes.has(path) && !nativeRoutes.has(path)) errors.add(`unexpected native route: ${path}`);
const markdownFiles = new Set([...expected].filter(file => file !== '404.html').map(file => file.replace(/\.html$/, '.md')));
// Public package downloads use the actual packed names of the four prepared native packages.
const packageFiles = ['primitives', 'icons', 'themes', 'charts'].map(name => {
  const manifest: { name: string; version: string } = JSON.parse(readFileSync(resolve(import.meta.dirname, `../../../.library/packages/${name}/package.json`), 'utf8'));
  return `packages/${manifest.name.slice(1).replace('/', '-')}-${manifest.version}.tgz`;
});
const publicFiles = new Set(['_headers', 'search-index.json', 'NOTICE.txt', 'WEBSITE-LICENSE.txt', 'favicon.png', 'favicon-black.svg', 'favicon-white.svg', ...packageFiles]);
for (const file of packageFiles) if (!existsSync(resolve(output, file))) errors.add(`missing package download: out/${file}`);
// D3 license closure: the downloadable Charts tarball imports D3 as a dependency and ships its attribution, so
// its license files carry every resolved D3 package's own LICENSE verbatim and keep the solid-recharts and
// Recharts MIT notices. NOTICE.txt coverage of the site bundle is checked against the runtime graph below.
const chartsRoot = resolve(import.meta.dirname, '../../../.library/packages/charts');
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
const notice = normalize(readFileSync(resolve(output, 'NOTICE.txt'), 'utf8'));
const chartsTarball = resolve(output, packageFiles[3]);
const chartsLicenseFiles = existsSync(chartsTarball)
  ? execFileSync('tar', ['-tzf', chartsTarball], { encoding: 'utf8' }).split('\n').filter(member => /^package\/(?:LICEN[CS]E|NOTICE)[^/]*$/i.test(member))
    .map(member => normalize(execFileSync('tar', ['-xzOf', chartsTarball, member], { encoding: 'utf8' })))
  : [];
const chartsLicense = chartsLicenseFiles.join(' ');
if (!/Copyright \(c\) 2026 Thomas Guehenneux/.test(chartsLicense) || !/Copyright \(c\) 2015-present recharts/.test(chartsLicense)) errors.add('packed Charts LICENSE lost the solid-recharts or Recharts MIT notice');
// The site bundles Charts, so NOTICE.txt reproduces every headed section of the packed license files verbatim.
for (const section of chartsLicenseFiles.flatMap(file => file.split(/--- .+? ---/).slice(1)).map(part => part.trim()).filter(Boolean)) {
  if (!notice.includes(section)) errors.add(`NOTICE.txt lacks packed Charts license text: ${section.slice(0, 60)}…`);
}
const chartsMit = chartsLicenseFiles.find(text => text.includes('Thomas Guehenneux'))?.split(/--- .+? ---/)[0].trim();
if (chartsMit && !notice.includes(chartsMit)) errors.add('NOTICE.txt lacks the packed Charts MIT LICENSE');
const d3Packages = new Map<string, string>();
const visit = (from: string, name: string) => {
  // D3 `exports` hide `./package.json`, so walk Node's node_modules lookup paths; realpath follows pnpm links.
  const lookup = createRequire(resolve(from, 'package.json')).resolve.paths(name) ?? [];
  const found = lookup.map(directory => resolve(directory, name, 'package.json')).find(path => existsSync(path));
  if (!found) { errors.add(`cannot resolve ${name} from ${from}`); return; }
  const manifestPath = realpathSync(found);
  const manifest: { name: string; version: string; dependencies?: Record<string, string> } = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const id = `${manifest.name}@${manifest.version}`;
  if (d3Packages.has(id)) return;
  d3Packages.set(id, normalize(readFileSync(resolve(manifestPath, '../LICENSE'), 'utf8')));
  for (const dependency of Object.keys(manifest.dependencies ?? {})) visit(dirname(manifestPath), dependency);
};
for (const name of ['d3-scale', 'd3-shape']) visit(chartsRoot, name);
for (const [id, license] of d3Packages) if (!chartsLicense.includes(license)) errors.add(`packed Charts LICENSE/NOTICE files lack the verbatim LICENSE of ${id}`);
// Every package whose code reaches the client chunks (written by the runtime-graph Vite plugin) has a
// `--- <id> ` section in NOTICE.txt carrying its own license file verbatim. solid-js and @solidjs/web 2.0.0-rc.15
// publish no license file; their sections reproduce the solidjs/solid LICENSE at 4937f0a2bfddd45a65738c189075aff577530073
// (the commit both rc.15 tags point to), verified against that file's SHA-256.
const unlicensedPackages = new Map(['solid-js@2.0.0-rc.15', '@solidjs/web@2.0.0-rc.15'].map(id => [id, '59a76ed2f4a3ebe8d20a58869ef9c09420f796aa179420c8fb916f5557defc9b']));
const rawNotice = readFileSync(resolve(output, 'NOTICE.txt'), 'utf8');
const runtimeGraph: Record<string, string> = JSON.parse(readFileSync(resolve(import.meta.dirname, '../dist/client/.vite/runtime-graph.json'), 'utf8'));
for (const [id, root] of Object.entries(runtimeGraph)) {
  const licenseFile = readdirSync(root).find(file => /^(?:licen[cs]e|copying)(?:\.(?:md|txt))?$/i.test(file));
  // Licensed packages need their header and whole license text (the Charts LICENSE embeds its own `--- Recharts
  // reference source ---` heading, so containment, not section equality). Without a license file a package fails
  // unless it is pinned above and its section hashes to that upstream file.
  const section = rawNotice.split(`\n--- ${id} (`)[1]?.split('\n--- ')[0]?.replace(/^[^\n]*\n/, '').trim();
  const verbatim = licenseFile ? section !== undefined && notice.includes(normalize(readFileSync(resolve(root, licenseFile), 'utf8')))
    : section !== undefined && createHash('sha256').update(`${section}\n`).digest('hex') === unlicensedPackages.get(id);
  if (!verbatim) errors.add(`NOTICE.txt lacks the verbatim license of bundled ${id}`);
}
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
if (existsSync(resolve(output, '_headers')) && /noindex/i.test(readFileSync(resolve(output, '_headers'), 'utf8'))) errors.add('out/_headers sends noindex');
for (const file of files) {
  if (!expected.has(file)) errors.add(`unregistered page out/${file}`);
  if (file !== '404.html' && !existsSync(resolve(output, file.replace(/\.html$/, '.md')))) errors.add(`missing Markdown twin out/${file}`);
  const tree = parser.parse(readFileSync(resolve(output, file), 'utf8'));
  ids.set(file, new Set(selectAll('[id]', tree).map(node => String(node.properties.id))));
  if (selectAll('meta[name="robots"]', tree).some(meta => /noindex/i.test(String(meta.properties.content)))) errors.add(`${file}: page is noindex`);
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
  console.log(`Static export check passed (${routePaths.length} registered routes + 404, ${links.length} page/asset/search references, Markdown twins and indexable pages).`);
}
