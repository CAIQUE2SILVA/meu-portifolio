import type { Context } from '@netlify/edge-functions';

const STATIC_EXTENSIONS = new Set([
  'css',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'js',
  'json',
  'map',
  'pdf',
  'png',
  'svg',
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

function estimateTokens(text: string): string {
  return String(Math.ceil(text.length / 4));
}

export default async (request: Request, context: Context): Promise<Response> => {
  if (!acceptsMarkdown(request)) {
    return context.next();
  }

  const { pathname } = new URL(request.url);
  if (hasStaticExtension(pathname)) {
    return context.next();
  }

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
};
