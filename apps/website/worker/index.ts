import { resolveRedirect } from './redirects.ts';

export interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
const markdownTypes = ['text/markdown', 'text/x-markdown'];
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const redirect = resolveRedirect(url);
    if (redirect) return new Response(null, { status: redirect.status, headers: { Location: redirect.location } });
    const segment = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);
    const negotiated = (request.method === 'GET' || request.method === 'HEAD') && segment !== '' && !segment.includes('.');
    if (negotiated && markdownTypes.some(type => (request.headers.get('accept') ?? '').includes(type))) {
      const twin = new URL(url);
      twin.pathname = `${url.pathname}.md`;
      const markdown = await env.ASSETS.fetch(new Request(twin, request));
      if (markdown.ok) return vary(markdown);
    }
    const response = await env.ASSETS.fetch(request);
    return negotiated ? vary(response) : response;
  }
};
function vary(response: Response): Response {
  const headers = new Headers(response.headers);
  if (!(headers.get('Vary') ?? '').split(',').some(value => value.trim().toLowerCase() === 'accept')) headers.append('Vary', 'Accept');
  return new Response(response.body, { status: response.status, headers });
}
