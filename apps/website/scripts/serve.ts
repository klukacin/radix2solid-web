import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import worker from '../worker/index.ts';

const root = resolve(import.meta.dirname, '../out');
// Shared with playwright.config.ts and e2e/website.spec.ts; override to run a second preview beside 4149.
const port = Number(process.env.WEBSITE_PREVIEW_PORT ?? 4149);
const origin = `http://127.0.0.1:${port}`;
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.gz': 'application/gzip' };
export async function assets(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);
  if (path !== '/' && path.endsWith('/')) return new Response(null, { status: 307, headers: { Location: `${url.pathname.replace(/\/+$/, '')}${url.search}` } });
  const file = resolve(root, `.${path === '/' ? '/index.html' : extname(path) ? path : `${path}.html`}`);
  if (!file.startsWith(`${root}${sep}`)) return new Response(null, { status: 400 });
  let content: Buffer;
  let status = 200;
  try { content = await readFile(file); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    content = await readFile(resolve(root, '404.html')); status = 404;
  }
  return new Response(request.method === 'HEAD' ? null : content as Buffer<ArrayBuffer>, { status, headers: {
    'Content-Type': status === 404 ? types['.html'] : types[extname(file)] ?? 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff', 'Strict-Transport-Security': 'max-age=63072000',
    'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache'
  } });
}
if (import.meta.main) createServer(async (incoming, outgoing) => {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
    const response = await worker.fetch(new Request(new URL(incoming.url ?? '/', origin), { method: incoming.method ?? 'GET', headers }), { ASSETS: { fetch: assets } });
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(incoming.method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()));
  } catch (error) { console.error(error); outgoing.writeHead(error instanceof URIError ? 400 : 500).end(); }
}).listen(port, '127.0.0.1', () => console.log(`Native static website ${origin}`));
