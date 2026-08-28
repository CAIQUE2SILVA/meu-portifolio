# Cloudflare — acesso para agentes de IA

O domínio `www.caiquenonato.com.br` usa Cloudflare na frente do Netlify. O **Bot Fight Mode / Managed Challenge** pode bloquear agentes em rotas como `/auth.md`, `/portfolio.md` e `Accept: text/markdown`, retornando a página "Just a moment...".

Configure estas exceções no [dashboard Cloudflare](https://dash.cloudflare.com/) da zona `caiquenonato.com.br`.

## 1. Regra de configuração — não aplicar challenge em rotas de agentes

**Rules → Configuration Rules → Create rule**

**Nome:** `Allow agent discovery paths`

**When incoming requests match:**

```txt
(http.host eq "www.caiquenonato.com.br" or http.host eq "caiquenonato.com.br")
and (
  starts_with(http.request.uri.path, "/.well-known/")
  or http.request.uri.path eq "/auth.md"
  or http.request.uri.path eq "/portfolio.md"
  or http.request.uri.path eq "/robots.txt"
  or http.request.uri.path eq "/sitemap.xml"
)
```

**Then:**

| Setting | Value |
|---------|-------|
| Browser Integrity Check | Off |
| Security Level | Essentially Off |

> Se a sua conta tiver **Bot Fight Mode**, crie também uma **WAF Custom Rule** com action **Skip** para as mesmas rotas e marque *Bot Fight Mode* e *Managed Challenge*.

## 2. Negociação Markdown

Garanta que requisições com `Accept: text/markdown` não sejam desafiadas:

**Expression adicional (OR):**

```txt
http.request.headers["accept"][*] contains "text/markdown"
```

Inclua essa condição na mesma regra de skip acima.

## 3. Cache (opcional)

Para reduzir latência de agentes:

**Rules → Cache Rules**

- Match: `starts_with(http.request.uri.path, "/.well-known/")`
- Cache eligibility: Eligible for cache
- Edge TTL: 1 hour

## 4. Validação

Após publicar as regras (propagação em ~1–2 min):

```bash
curl -sI -H "Accept: text/markdown" https://www.caiquenonato.com.br/ | rg -i 'content-type|x-markdown'
curl -sI https://www.caiquenonato.com.br/auth.md | rg -i content-type
curl -s https://www.caiquenonato.com.br/.well-known/oauth-protected-resource | head
```

Scanner:

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.caiquenonato.com.br"}'
```

## 5. DNS-AID

Com domínio próprio no Cloudflare, publique registros DNS-AID conforme [`DNS-AID.md`](./DNS-AID.md) e habilite **DNSSEC** na zona.
