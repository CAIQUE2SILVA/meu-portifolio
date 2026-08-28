import type { Context } from '@netlify/edge-functions';

const DISCOVERY_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
  '</.well-known/ai-catalog.json>; rel="agent-catalog"; type="application/json"',
  '</auth.md>; rel="service-doc"; type="text/markdown"',
].join(', ');

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

function isHomepagePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/home' || pathname === '/home/';
}

function estimateTokens(text: string): string {
  return String(Math.ceil(text.length / 4));
}

async function serveMarkdown(request: Request): Promise<Response> {
  const markdownUrl = new URL('/portfolio.md', request.url);
  const markdownResponse = await fetch(markdownUrl.toString(), {
    headers: { Accept: 'text/plain' },
  });

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
  const tokenUrl = new URL('/portfolio.tokens', request.url);
  const tokenResponse = await fetch(tokenUrl.toString());
  const tokenCount = tokenResponse.ok
    ? (await tokenResponse.text()).trim()
    : estimateTokens(markdown);

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': tokenCount,
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function withDiscoveryHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Link', DISCOVERY_LINK_HEADER);
  headers.append('Vary', 'Accept');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async (request: Request, context: Context): Promise<Response> => {
  const { pathname } = new URL(request.url);

  if (acceptsMarkdown(request) && !hasStaticExtension(pathname)) {
    return serveMarkdown(request);
  }

  const response = await context.next();

  if (isHomepagePath(pathname) && (response.headers.get('Content-Type') ?? '').includes('text/html')) {
    return withDiscoveryHeaders(response);
  }

  return response;
};
