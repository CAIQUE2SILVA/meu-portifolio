#!/usr/bin/env node
/**
 * Generates agent discovery artifacts into www/ after the Angular build.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN, WELL_KNOWN, absolute } from './agent-discovery.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'www');
const sourceDir = join(root, 'src/agent-discovery');

function writeOutput(relativePath, content, encoding = 'utf8') {
  const target = join(outDir, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, encoding);
}

function sha256(content) {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const portfolioSkillPath = join(sourceDir, 'agent-skills/portfolio/SKILL.md');
const portfolioSkill = readFileSync(portfolioSkillPath, 'utf8');
const portfolioSkillUrl = absolute('/.well-known/agent-skills/portfolio/SKILL.md');

writeOutput('.well-known/agent-skills/portfolio/SKILL.md', portfolioSkill);

const agentSkillsIndex = {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: [
    {
      name: 'portfolio-content',
      type: 'skill-md',
      description:
        'Fetch and summarize the portfolio of Caique Nonato da Silva in Markdown, including projects, experience, and skills.',
      url: portfolioSkillUrl,
      digest: sha256(portfolioSkill),
    },
  ],
};

writeOutput('.well-known/agent-skills/index.json', json(agentSkillsIndex));

const contactOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'Portfolio Contact API',
    version: '1.0.0',
    description: 'Sends a contact message from the portfolio contact form.',
  },
  servers: [{ url: SITE_ORIGIN }],
  paths: {
    '/.netlify/functions/contact': {
      post: {
        summary: 'Submit a contact message',
        operationId: 'submitContact',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'email', 'assunto', 'mensagem'],
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  assunto: { type: 'string' },
                  mensagem: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Message accepted for delivery',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    id: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

writeOutput('.well-known/openapi/contact.json', json(contactOpenApi));

const apiCatalog = {
  linkset: [
    {
      anchor: absolute('/.netlify/functions/contact'),
      'service-desc': [
        {
          href: absolute(WELL_KNOWN.contactOpenApi),
          type: 'application/openapi+json',
        },
      ],
      'service-doc': [
        {
          href: absolute(WELL_KNOWN.authMd),
          type: 'text/markdown',
        },
      ],
      status: [
        {
          href: absolute(WELL_KNOWN.health),
        },
      ],
    },
    {
      anchor: absolute('/'),
      'service-desc': [
        {
          href: absolute(WELL_KNOWN.portfolioMarkdown),
          type: 'text/markdown',
        },
      ],
      'service-doc': [
        {
          href: absolute(WELL_KNOWN.authMd),
          type: 'text/markdown',
        },
      ],
      status: [
        {
          href: absolute(WELL_KNOWN.health),
        },
      ],
    },
  ],
};

writeOutput('.well-known/api-catalog', json(apiCatalog));

writeOutput('.well-known/health', json({ status: 'ok', service: 'meu-portifolio' }));

const oauthAuthorizationServer = {
  issuer: SITE_ORIGIN,
  authorization_endpoint: absolute('/.well-known/oauth/authorize'),
  token_endpoint: absolute('/.well-known/oauth/token'),
  jwks_uri: absolute('/.well-known/jwks.json'),
  grant_types_supported: ['client_credentials', 'urn:ietf:params:oauth:grant-type:jwt-bearer'],
  response_types_supported: ['token'],
  token_endpoint_auth_methods_supported: ['none', 'private_key_jwt'],
  scopes_supported: ['contact:write', 'portfolio:read'],
  agent_auth: {
    skill: absolute(WELL_KNOWN.authMd),
    register_uri: absolute('/.well-known/agent/register'),
    identity_types_supported: ['anonymous'],
    anonymous: {
      credential_types_supported: ['api_key'],
      claim_uri: absolute('/.well-known/agent/claim'),
    },
  },
};

writeOutput('.well-known/oauth-authorization-server', json(oauthAuthorizationServer));
writeOutput('.well-known/jwks.json', json({ keys: [] }));

const oauthProtectedResource = {
  resource: absolute('/.netlify/functions/contact'),
  authorization_servers: [SITE_ORIGIN],
  scopes_supported: ['contact:write'],
  bearer_methods_supported: ['header'],
  resource_documentation: absolute(WELL_KNOWN.authMd),
};

writeOutput('.well-known/oauth-protected-resource', json(oauthProtectedResource));

const mcpServerCard = {
  serverInfo: {
    name: 'portfolio-webmcp',
    version: '1.0.0',
    description:
      'Browser WebMCP tools for navigating the portfolio and reading structured content. HTTP MCP transport is not provided.',
  },
  transport: {
    type: 'streamable-http',
    endpoint: absolute('/.well-known/mcp/index.json'),
  },
  capabilities: {
    tools: {
      listChanged: false,
    },
    resources: {},
    prompts: {},
  },
  webmcp: {
    enabled: true,
    documentation: absolute(WELL_KNOWN.authMd),
  },
};

writeOutput('.well-known/mcp/server-card.json', json(mcpServerCard));
writeOutput(
  '.well-known/mcp/index.json',
  json({
    protocol: 'mcp',
    status: 'browser-tools-only',
    serverCard: absolute(WELL_KNOWN.mcpServerCard),
    message:
      'This site exposes tools through WebMCP in the browser. Use the MCP server card for discovery metadata.',
  }),
);

const aiCatalog = {
  specVersion: '1.0',
  host: {
    displayName: 'Portfólio Caique Nonato',
    identifier: `did:web:${new URL(SITE_ORIGIN).hostname}`,
  },
  entries: [
    {
      identifier: 'urn:air:caique-portifolio.netlify.app:skill:portfolio-content',
      displayName: 'Portfolio Content Skill',
      type: 'text/markdown',
      url: portfolioSkillUrl,
      representativeQueries: [
        'what projects has Caique built with Angular',
        'summarize Caique professional experience',
        'list skills and technologies in the portfolio',
      ],
    },
    {
      identifier: 'urn:air:caique-portifolio.netlify.app:api:contact',
      displayName: 'Portfolio Contact API',
      type: 'application/openapi+json',
      url: absolute(WELL_KNOWN.contactOpenApi),
      representativeQueries: [
        'how do I send a contact message through the portfolio API',
        'what fields are required to submit the contact form',
      ],
    },
    {
      identifier: 'urn:air:caique-portifolio.netlify.app:server:webmcp',
      displayName: 'Portfolio WebMCP Tools',
      type: 'application/mcp-server-card+json',
      url: absolute(WELL_KNOWN.mcpServerCard),
      representativeQueries: [
        'navigate to the projects section of the portfolio',
        'list featured GitHub projects',
        'switch the portfolio language to English',
      ],
    },
  ],
};

writeOutput('.well-known/ai-catalog.json', json(aiCatalog));

const authMd = `# Portfólio Caique Nonato — auth.md

## Audience

AI agents and automated clients consuming the public portfolio of Caique Nonato da Silva.

## Public read access

Portfolio pages are publicly readable. Request Markdown with:

\`\`\`http
GET /
Accept: text/markdown
\`\`\`

Machine-readable discovery documents:

- API catalog: ${absolute(WELL_KNOWN.apiCatalog)}
- Agent skills index: ${absolute(WELL_KNOWN.agentSkillsIndex)}
- ARD manifest: ${absolute(WELL_KNOWN.aiCatalog)}
- MCP server card: ${absolute(WELL_KNOWN.mcpServerCard)}

## Protected write API

The contact endpoint \`POST /.netlify/functions/contact\` accepts JSON payloads with \`nome\`, \`email\`, \`assunto\`, and \`mensagem\`.

Protected resource metadata: ${absolute(WELL_KNOWN.oauthProtectedResource)}

## Agent registration

OAuth authorization server metadata: ${absolute(WELL_KNOWN.oauthAuthorizationServer)}

Anonymous agent registration is supported for read-only portfolio access. Use the \`agent_auth.register_uri\` advertised in the authorization server metadata when write scopes are required.

## WebMCP

Interactive browser tools are registered at page load through \`navigator.modelContext.registerTool()\` for navigation, project lookup, and language switching.
`;

writeOutput('auth.md', authMd);

const headers = `/*
  Link: </.well-known/api-catalog>; rel="api-catalog", </.well-known/agent-skills/index.json>; rel="describedby", </.well-known/ai-catalog.json>; rel="agent-catalog"; type="application/json", </auth.md>; rel="service-doc"; type="text/markdown"
  Access-Control-Allow-Origin: *

/.well-known/api-catalog
  Content-Type: application/linkset+json
  Access-Control-Allow-Origin: *

/.well-known/agent-skills/*
  Access-Control-Allow-Origin: *

/.well-known/ai-catalog.json
  Content-Type: application/json
  Access-Control-Allow-Origin: *

/.well-known/mcp/*
  Content-Type: application/json
  Access-Control-Allow-Origin: *

/.well-known/oauth-authorization-server
  Content-Type: application/json
  Access-Control-Allow-Origin: *

/.well-known/oauth-protected-resource
  Content-Type: application/json
  Access-Control-Allow-Origin: *

/.well-known/health
  Content-Type: application/json
  Access-Control-Allow-Origin: *

/.well-known/openapi/*
  Content-Type: application/json
  Access-Control-Allow-Origin: *

/auth.md
  Content-Type: text/markdown; charset=utf-8
  Access-Control-Allow-Origin: *
`;

writeOutput('_headers', headers);

console.log('Generated agent discovery artifacts in www/');
