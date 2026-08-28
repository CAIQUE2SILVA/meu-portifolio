import { isHomepagePath, isWellKnownPath, withDiscoveryHeaders, withWellKnownHeaders } from './agent-discovery';

const STATIC_EXTENSIONS = new Set([
  'css',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'js',
  'json',
  'map',
  'md',
  'pdf',
  'png',
  'svg',
  'tokens',
  'txt',
  'webp',
  'woff',
  'woff2',
  'xml',
]);

const MARKDOWN_ASSET_PATH = '/portfolio.md';
const TOKEN_ASSET_PATH = '/portfolio.tokens';

function acceptsMarkdown(request: Request): boolean {
  const accept = request.headers.get('Accept') ?? '';
  return accept.toLowerCase().includes('text/markdown');
}

function hasStaticExtension(pathname: string): boolean {
  const lastSegment = pathname.split('/').pop() ?? '';
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex <= 0) {
    return false;
  }

  return STATIC_EXTENSIONS.has(lastSegment.slice(dotIndex + 1).toLowerCase());
}

function estimateTokens(text: string): string {
  return String(Math.ceil(text.length / 4));
}

async function fetchAsset(env: Env, request: Request, pathname: string): Promise<Response> {
  const assetRequest = new Request(new URL(pathname, request.url), {
    method: 'GET',
    headers: { Accept: '*/*' },
  });

  return env.ASSETS.fetch(assetRequest);
}

async function serveMarkdown(env: Env, request: Request): Promise<Response> {
  const markdownResponse = await fetchAsset(env, request, MARKDOWN_ASSET_PATH);

  if (!markdownResponse.ok) {
    return new Response('Markdown representation is not available.', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        Vary: 'Accept',
      },
    });
  }

  const markdown = await markdownResponse.text();
  const tokenResponse = await fetchAsset(env, request, TOKEN_ASSET_PATH);
  const tokenCount = tokenResponse.ok
    ? (await tokenResponse.text()).trim()
    : estimateTokens(markdown);

  const headers = new Headers(markdownResponse.headers);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('x-markdown-tokens', tokenCount);
  headers.set('Vary', 'Accept');
  headers.delete('Content-Encoding');
  headers.delete('Content-Length');

  return new Response(markdown, {
    status: markdownResponse.status,
    headers,
  });
}

function isHtmlResponse(response: Response): boolean {
  const contentType = response.headers.get('Content-Type') ?? '';
  return contentType.includes('text/html');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (isWellKnownPath(pathname)) {
      const response = await fetchAsset(env, request, pathname);
      return withWellKnownHeaders(pathname, response);
    }

    if (acceptsMarkdown(request) && !hasStaticExtension(pathname)) {
      return serveMarkdown(env, request);
    }

    const response = await env.ASSETS.fetch(request);

    if (isHomepagePath(pathname) && isHtmlResponse(response)) {
      return withDiscoveryHeaders(response);
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
