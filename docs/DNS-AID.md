# DNS for AI Discovery (DNS-AID)

Este repositório publica descoberta HTTP (Link headers, `/.well-known/*`, `auth.md`, WebMCP). **Registros DNS-AID devem ser criados no provedor DNS** — não podem ser commitados no código.

## Domínio alvo

`www.caiquenonato.com.br` (canônico) e `caiquenonato.com.br` (apex).

## Registros recomendados

No painel DNS da zona `caiquenonato.com.br` (Cloudflare):

```dns
; Entrada de índice para descoberta de agentes
_index._agents.caiquenonato.com.br. 3600 IN HTTPS 1 www.caiquenonato.com.br. alpn=h3,h2 port=443 mandatory=alpn,port

; Ponteiro para o manifesto ARD
_catalog._agents.caiquenonato.com.br. 3600 IN TXT "url=https://www.caiquenonato.com.br/.well-known/ai-catalog.json"
```

Se o painel não aceitar registros `_agents` no subdomínio `www`, use o apex `caiquenonato.com.br` como mostrado acima.

## DNSSEC

DNS-AID autenticado exige zona assinada com DNSSEC:

1. Cloudflare → **DNS** → **Settings** → **Enable DNSSEC**
2. Publique o registro **DS** no registrador do domínio
3. Aguarde propagação (até 24 h)

## Validação

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.caiquenonato.com.br"}'
```

Verifique `checks.discoverability.dnsAid.status`.

## Cloudflare

Se o tráfego passa pelo Cloudflare, configure também as exceções de bot em [`CLOUDFLARE-AGENT-ACCESS.md`](./CLOUDFLARE-AGENT-ACCESS.md).
