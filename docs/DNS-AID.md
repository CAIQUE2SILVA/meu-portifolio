# DNS for AI Discovery (DNS-AID)

This repository publishes HTTP-based agent discovery (Link headers, `/.well-known/*`, `auth.md`, WebMCP). **DNS-AID records must be configured at your DNS provider** — they cannot be committed to the application repository.

## Target domain

`caique-portifolio.netlify.app` (or your custom domain if you add one in Netlify/Cloudflare).

## Recommended records

Publish an index entry and optional catalog pointer using SVCB/HTTPS records under the `_agents` namespace:

```dns
; Index entry for agent discovery (ServiceMode SVCB)
_index._agents.caique-portifolio.netlify.app. 3600 IN HTTPS 1 caique-portifolio.netlify.app. alpn=h3,h2 port=443

; Optional catalog pointer (TXT fallback while draft parameters are experimental)
_catalog._agents.caique-portifolio.netlify.app. 3600 IN TXT "url=https://caique-portifolio.netlify.app/.well-known/ai-catalog.json"
```

If you use a custom apex domain (for example `example.com`), replace the hostnames accordingly:

```dns
_index._agents.example.com. 3600 IN HTTPS 1 example.com. alpn=h3,h2 port=443 mandatory=alpn,port
_catalog._agents.example.com. 3600 IN TXT "url=https://example.com/.well-known/ai-catalog.json"
```

## DNSSEC

DNS-AID discovery is authenticated when the public zone is signed with DNSSEC. Enable DNSSEC in your DNS provider (Cloudflare, Netlify DNS, Route 53, etc.) and publish DS records at your registrar.

## Validation

After DNS propagation, validate with:

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://caique-portifolio.netlify.app"}'
```

Check `checks.discoverability.dnsAid.status`.

## Notes for Netlify subdomains

Netlify-managed `*.netlify.app` subdomains may not allow custom `_agents` records. For full DNS-AID support, attach a custom domain where you control DNS and DNSSEC.
