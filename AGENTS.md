# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single frontend app: an **Angular 19 + Ionic/Capacitor** portfolio SPA (`meu-portifolio`). There is no backend to run; the contact form posts to Netlify Forms in production only. Node 22 and Google Chrome are preinstalled on the VM.

**Git commits:** use only `CAIQUE2SILVA <64806656+CAIQUE2SILVA@users.noreply.github.com>` as author and committer. Do not add `Co-authored-by` trailers or commit as `Cursor Agent`. Before the first commit in a session, run:

```bash
git config user.name "CAIQUE2SILVA"
git config user.email "64806656+CAIQUE2SILVA@users.noreply.github.com"
git config core.hooksPath .githooks
```

The repo `.githooks/` keeps Cursor secret scanning but disables the automatic co-author hook.

Standard commands live in `package.json` and `README.md`. Key notes:

- **Dev server:** `npm start` (alias for `ng serve`) serves at `http://localhost:4200`. Default build configuration is `production`; `ng serve` uses the `development` configuration.
- **Lint:** `npm run lint` (`ng lint`).
- **Tests:** `ng test` defaults to headed Chrome with watch mode. In the cloud VM run headless and non-watching: `CHROME_BIN=$(which google-chrome-stable) npx ng test --watch=false --browsers=ChromeHeadless`. Chrome Headless launches fine without a `--no-sandbox` custom launcher.
- **Known pre-existing test failures (not env issues):** `HomePage` and `NavComponent` specs fail with `No provider for ActivatedRoute!` because their `TestBed` setup omits router testing providers. This is a bug in the committed spec files, unrelated to environment setup.
- The contact form component (`app-contato`) is intentionally commented out in `src/app/pages/home/home.page.html`, so it is not rendered. The main interactive feature on the page is the top-nav smooth-scroll routing (Angular router fragment navigation to sections like `#projetos`, `#sobre`).
- Build output goes to `www/` (consumed by Netlify per `netlify.toml`, and Cloudflare Workers via `wrangler.jsonc`). Neither deploy target needs to run for local development.
- **Markdown for Agents:** `npm run build` generates `www/portfolio.md`. Requests with `Accept: text/markdown` are served markdown via the Cloudflare Worker (`worker/index.ts`) and the Netlify Edge Function (`netlify/edge-functions/agent-discovery.ts`). HTML remains the default for browsers.
- **Agent discovery:** `npm run build` also generates `/.well-known/*`, `auth.md`, and `_headers` (see `scripts/generate-agent-discovery.mjs`). Canonical origin: `https://www.caiquenonato.com.br`. DNS-AID: `docs/DNS-AID.md`. Cloudflare bot bypass: `docs/CLOUDFLARE-AGENT-ACCESS.md`.
