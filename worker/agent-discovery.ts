export const DISCOVERY_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
  '</.well-known/ai-catalog.json>; rel="agent-catalog"; type="application/json"',
  '</auth.md>; rel="service-doc"; type="text/markdown"',
].join(', ');

const WELL_KNOWN_CONTENT_TYPES: Record<string, string> = {
  '/.well-known/api-catalog': 'application/linkset+json; charset=utf-8',
  '/.well-known/agent-skills/index.json': 'application/json; charset=utf-8',
  '/.well-known/ai-catalog.json': 'application/json; charset=utf-8',
  '/.well-known/mcp/server-card.json': 'application/json; charset=utf-8',
  '/.well-known/mcp/index.json': 'application/json; charset=utf-8',
  '/.well-known/oauth-authorization-server': 'application/json; charset=utf-8',
  '/.well-known/oauth-protected-resource': 'application/json; charset=utf-8',
  '/.well-known/jwks.json': 'application/json; charset=utf-8',
  '/.well-known/health': 'application/json; charset=utf-8',
  '/.well-known/openapi/contact.json': 'application/json; charset=utf-8',
  '/.well-known/agent/register': 'application/json; charset=utf-8',
  '/.well-known/agent/claim': 'application/json; charset=utf-8',
  '/.well-known/agent-skills/portfolio/SKILL.md': 'text/markdown; charset=utf-8',
  '/auth.md': 'text/markdown; charset=utf-8',
  '/portfolio.md': 'text/markdown; charset=utf-8',
};

export function isHomepagePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/home' || pathname === '/home/';
}

export function isWellKnownPath(pathname: string): boolean {
  return (
    pathname.startsWith('/.well-known/') ||
    pathname === '/auth.md' ||
    pathname === '/portfolio.md'
  );
}

export function withDiscoveryHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Link', DISCOVERY_LINK_HEADER);
  headers.append('Vary', 'Accept');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function withWellKnownHeaders(pathname: string, response: Response): Response {
  const contentType = WELL_KNOWN_CONTENT_TYPES[pathname];
  if (!contentType) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('Content-Type', contentType);
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
