import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdir } from 'node:fs/promises';
import worker from './index.ts';
import { assets } from '../scripts/serve.ts';

const route = '/primitives/docs/components/dialog';
const fetch = (path: string, options?: RequestInit) => worker.fetch(new Request(`https://radix-solid.test${path}`, options), { ASSETS: { fetch: assets } });

test('real static worker keeps redirect precedence, query, trailing slash, methods and 404 behavior', async () => {
  const redirect = await fetch('/docs/primitives/components/dialog?tab=api&literal=%23%2F', { headers: { Accept: 'text/markdown' } });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('Location'), `${route}?tab=api&literal=%23%2F`);
  const slash = await fetch(`${route}/?tab=api`, { headers: { Accept: 'text/markdown' } });
  assert.equal(slash.status, 307);
  assert.equal(slash.headers.get('Location'), `${route}?tab=api`);
  const post = await fetch(route, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('Allow'), 'GET, HEAD');
  const missing = await fetch('/missing-native-page', { headers: { Accept: 'text/markdown' } });
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get('Content-Type')!, /text\/html/);
  assert.match(await missing.text(), /Page not found/);
});

test('real Markdown and HTML cache variants, HEAD and hashed assets preserve headers', async () => {
  const html = await fetch(route);
  assert.equal(html.status, 200);
  assert.equal(html.headers.get('Vary'), 'Accept');
  assert.match(await html.text(), /defaultOpen/);
  const markdown = await fetch(`${route}?same=1`, { headers: { Accept: 'text/x-markdown' } });
  assert.equal(markdown.status, 200);
  assert.equal(markdown.headers.get('Vary'), 'Accept');
  assert.match(markdown.headers.get('Content-Type')!, /text\/markdown; charset=utf-8/);
  const text = await markdown.text();
  assert.match(text, /^# Dialog/m);
  assert.match(text, /^## API Reference/m);
  assert.doesNotMatch(text, /<!--|React\.|react-dom|@radix-ui\/react/);
  assert.equal(await (await fetch(`${route}.md`)).text(), text);
  const head = await fetch(route, { method: 'HEAD', headers: { Accept: 'text/markdown' } });
  assert.equal(head.status, 200);
  assert.match(head.headers.get('Content-Type')!, /text\/markdown/);
  assert.equal(await head.text(), '');
  const filename = (await readdir(new URL('../out/assets', import.meta.url))).find(file => file.endsWith('.js'))!;
  const asset = await fetch(`/assets/${filename}`);
  assert.equal(asset.status, 200);
  assert.equal(asset.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
  assert.equal(asset.headers.get('X-Content-Type-Options'), 'nosniff');
});
