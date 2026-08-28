export const SITE_ORIGIN = 'https://caique-portifolio.netlify.app';

export const WELL_KNOWN = {
  apiCatalog: '/.well-known/api-catalog',
  agentSkillsIndex: '/.well-known/agent-skills/index.json',
  aiCatalog: '/.well-known/ai-catalog.json',
  mcpServerCard: '/.well-known/mcp/server-card.json',
  oauthAuthorizationServer: '/.well-known/oauth-authorization-server',
  oauthProtectedResource: '/.well-known/oauth-protected-resource',
  health: '/.well-known/health',
  contactOpenApi: '/.well-known/openapi/contact.json',
  authMd: '/auth.md',
  portfolioMarkdown: '/portfolio.md',
};

export function absolute(path) {
  return `${SITE_ORIGIN}${path}`;
}
