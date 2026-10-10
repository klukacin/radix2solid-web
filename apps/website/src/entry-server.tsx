import { escape, generateHydrationScript, renderToString } from '@solidjs/web';
import { Website } from './website.js';
import { routes } from './routes.js';
import { appearanceScript } from './components/site-context.js';

export const routePaths = Object.keys(routes);
export const routeManifestKeys = Object.fromEntries(Object.entries(routes).map(([path, route]) => [path, route.manifestKey]));
export async function renderPage(path: string, clientEntry: string, stylesheets: string[]): Promise<string> {
  const route = await routes[path]?.load();
  const metadata = route?.frontmatter;
  const body = renderToString(() => <Website path={path} route={route} />, { renderId: 'site-' });
  const styles = stylesheets.map(href => `<link rel="stylesheet" href="${escape(href, true)}">`).join('');
  const title = `${metadata?.metaTitle ?? 'Page not found'} – Radix2Solid`;
  const description = `Radix2Solid is an unofficial native Solid 2 fork. ${metadata?.metaDescription ?? 'Primitives, icons, themes and documentation.'}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)}</title><meta name="description" content="${escape(description, true)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Radix2Solid"><meta property="og:title" content="${escape(title, true)}"><meta property="og:description" content="${escape(description, true)}"><meta property="og:image" content="/social/radix2solid.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title, true)}"><meta name="twitter:description" content="${escape(description, true)}"><meta name="twitter:image" content="/social/radix2solid.png"><link rel="icon" href="/favicon.png" type="image/png"><link rel="icon" href="/favicon-black.svg" type="image/svg+xml" media="(prefers-color-scheme: light)"><link rel="icon" href="/favicon-white.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)"><script>${appearanceScript}</script>${styles}${generateHydrationScript()}</head><body><div id="website">${body}</div><script type="module" src="${escape(clientEntry, true)}"></script></body></html>`;
}
