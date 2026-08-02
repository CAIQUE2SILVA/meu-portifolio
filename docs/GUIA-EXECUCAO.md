# Guia de execução — Redesign do portfólio

Passo a passo operacional para implementar o roadmap em [`ROADMAP.md`](./ROADMAP.md).  
Siga a ordem **P0 → P4**. Não pule fundação.

---

## Pré-requisitos gerais

- Node.js **22** (ou compatível com Angular 19)
- Google Chrome (testes headless)
- Repo clonado; dependências: `npm install`
- Branch sugerida por fase: `cursor/<fase-descricao>-9127` a partir de `master`
- Comandos de referência ([`AGENTS.md`](../AGENTS.md)):

```bash
npm start
# http://localhost:4200

npm run lint

CHROME_BIN=$(which google-chrome-stable) npx ng test --watch=false --browsers=ChromeHeadless

npm run build
```

---

## P0 — Fundação

### P0.1 — Restaurar assets

**Arquivos / pastas**

```text
src/assets/images/profile.png
src/assets/cv/Resume.pdf
src/assets/icon/favicon.png
```

`angular.json` já mapeia `src/assets` → `assets`. Confirmar que os paths batem com:

- [`src/app/pages/home/home.page.html`](../src/app/pages/home/home.page.html) (`assets/images/profile.png`, `assets/cv/Resume.pdf`)
- [`src/index.html`](../src/index.html) (favicon)

**Passos**

1. Criar as pastas se não existirem.
2. Adicionar foto profissional otimizada (WebP opcional depois; PNG ok na P0).
3. Adicionar PDF do currículo.
4. Adicionar favicon.
5. `npm start` e validar hero + link do CV + ícone da aba.

**Aceite:** nenhum 404 em `/assets/...` na home.

---

### P0.2 — Design tokens

**Arquivos**

- [`src/theme/variables.scss`](../src/theme/variables.scss) — hoje quase vazio
- [`src/global.scss`](../src/global.scss)

**Passos**

1. Definir em `:root` (exemplo):

```scss
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-ink: #0f172a;
  --color-muted: #475569;
  --color-accent: #4f46e5;
  --color-accent-hover: #4338ca;
  --color-panel: #0f172a;
  --color-panel-elevated: #1e293b;
  --font-body: 'Inconsolata', monospace;
  color-scheme: light;
}
```

2. Trocar hardcodes óbvios em `global.scss` / home / footer para `var(--...)`.
3. Manter a paleta atual (não migrar para tema genérico purple/cream).

**Aceite:** cores centrais vêm de tokens; visual da home não regrede.

---

### P0.3 — Corrigir specs

**Arquivos**

- [`src/app/pages/home/home.page.spec.ts`](../src/app/pages/home/home.page.spec.ts)
- [`src/app/components/nav/nav.component.spec.ts`](../src/app/components/nav/nav.component.spec.ts)
- [`src/app/components/contato/contato.component.spec.ts`](../src/app/components/contato/contato.component.spec.ts)

**Passos**

1. Em `HomePage` e `NavComponent`, configurar TestBed com router:

```ts
import { provideRouter } from '@angular/router';

await TestBed.configureTestingModule({
  imports: [HomePage], // ou NavComponent
  providers: [provideRouter([])],
}).compileComponents();
```

2. Em `ContatoComponent`:

```ts
import { provideHttpClient } from '@angular/common/http';

providers: [provideHttpClient()],
```

3. Rodar testes headless (comando no topo).

**Aceite:** smoke tests `should create` passam (ou falhas restantes não são `No provider for ActivatedRoute` / `HttpClient`).

---

### P0.4 — Cloudflare Workers publish path

**Arquivo:** [`wrangler.jsonc`](../wrangler.jsonc)

Hoje:

```jsonc
"assets": { "directory": "src" }
```

**Passos**

1. Alterar para o output do Angular:

```jsonc
"assets": {
  "directory": "www",
  "not_found_handling": "single-page-application"
}
```

2. `npm run build` depois `npm run preview` (ou `wrangler dev`) e confirmar SPA.

**Aceite:** Worker serve o build em `www/`, não o TypeScript/source.

---

### P0.5 — README técnico

Já iniciado nesta entrega de docs; na execução de código, manter README sincronizado com cada fase (versões, scripts, links `docs/`).

**Aceite:** nenhum “Angular 17 / Node 14” desatualizado.

---

## P1 — Estrutura madura

### P1.1 — Criar pastas e contratos

**Criar**

```text
src/app/models/
  project.model.ts
  experience.model.ts
  skill.model.ts
src/app/data/
  projects.data.ts
  experience.data.ts
  skills.data.ts
src/app/core/
  i18n/.gitkeep   # preenchido na P2
  gsap/.gitkeep   # preenchido na P3
```

**Exemplo de model**

```ts
// src/app/models/project.model.ts
export interface Project {
  id: string;
  titleKey: string;       // chave i18n
  stack: string[];
  descriptionKey: string;
  implementationKey: string;
  benefitKey: string;
  repoUrl?: string;
  demoUrl?: string;
}
```

**Passos**

1. Extrair os 5 projetos de [`projetos.component.html`](../src/app/components/projetos/projetos.component.html) para `projects.data.ts`.
2. Renderizar com `@for` no template.
3. Repetir padrão para experiência e skills quando fizer sentido.
4. Adicionar `id="educacao"` na seção e link na [`nav.component.html`](../src/app/components/nav/nav.component.html).

**Aceite:** mudar um projeto = editar um arquivo em `data/`; `#educacao` scrolla corretamente.

---

### P1.2 — Narrativa Ionic / Capacitor

**Arquivos:** README, eventualmente `capacitor.config.ts` (`appId` ainda `io.ionic.starter`).

**Passos**

1. Documentar que a UI é **Angular standalone**; Capacitor é opcional/bridge.
2. Se Capacitor permanecer, atualizar `appId` / `appName` para o projeto real.
3. Não adicionar componentes `ion-*` só por marketing.

**Aceite:** README e config não contradizem o código.

---

## P2 — i18n pt / en

### P2.1 — LanguageService

**Criar**

```text
src/app/core/i18n/language.service.ts
src/app/core/i18n/lang.type.ts
src/assets/i18n/pt.json
src/assets/i18n/en.json
```

**Esqueleto**

```ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Lang = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly dict = signal<Record<string, string>>({});
  readonly lang = signal<Lang>(this.readStored());

  constructor(private http: HttpClient) {
    this.load(this.lang());
  }

  t(key: string): string {
    return this.dict()[key] ?? key;
  }

  setLang(lang: Lang): void {
    localStorage.setItem('portfolio.lang', lang);
    this.lang.set(lang);
    this.load(lang);
  }

  private readStored(): Lang {
    const v = localStorage.getItem('portfolio.lang');
    return v === 'en' ? 'en' : 'pt';
  }

  private load(lang: Lang): void {
    this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`)
      .subscribe((d) => this.dict.set(d));
  }
}
```

Garantir `provideHttpClient()` em [`src/main.ts`](../src/main.ts) / `app.config` se ainda não existir.

### P2.2 — Toggle no nav

**Arquivos:** `nav.component.*`

1. Botões `PT` / `EN` (ou um toggle).
2. Chamar `setLang`.
3. Marcar idioma ativo com estilo usando `--color-accent`.

### P2.3 — Wire nas seções + SEO

1. Substituir strings da home/componentes por chaves (`language.t('hero.title')` ou pipe fino se preferir).
2. Em `HomePage`, ao trocar idioma, atualizar `Title` e `Meta` description (já há uso de `Meta`/`Title`).
3. Traduzir também `aria-label`s relevantes.

**Aceite:** reload mantém idioma; PT e EN cobrem hero → footer; meta tags mudam.

---

## P3 — GSAP + ScrollTrigger

### P3.1 — Instalar e registrar

```bash
npm install gsap
```

**Criar** [`src/app/core/gsap/register.ts`](../src/app/core/gsap/register.ts):

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsapRegistered(): typeof gsap {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };
```

Chamar `ensureGsapRegistered()` uma vez no bootstrap da home (ou factory de animações).

### P3.2 — Pinned panels with overscroll (`100vw`)

**Referência:** [Pinned panels with overscroll](https://demos.gsap.com/demo/pinned-panels-with-overscroll/)

**Onde:** orquestração em [`home.page.ts`](../src/app/pages/home/home.page.ts) + SCSS das seções (ou wrapper na home).

**Passos**

1. Marcar seções principais (sobre, skills, experiência, …) com classe comum, ex.: `.pin-panel`.
2. CSS:

```scss
.pin-panel {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}
```

3. Em `AfterViewInit`, dentro de `gsap.context`:

```ts
const gsap = ensureGsapRegistered();
const mm = gsap.matchMedia();

mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
  const panels = gsap.utils.toArray<HTMLElement>('.pin-panel');
  panels.forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false, // padrão da demo de overscroll/stack
      scrub: true,
    });
  });
});
```

4. Em `OnDestroy`: `ctx.revert()` (e/ou `mm.revert()`).
5. Em viewports menores: sem pin agressivo; manter scroll normal.

**Aceite:** desktop empilha/revela painéis full-bleed; mobile não prende scroll; refresh após resize ok (`ScrollTrigger.refresh()` se layout mudar com i18n).

**Riscos:** conflito com `scroll-behavior: smooth` + fragments do Angular Router — testar nav `#projetos` etc.; se necessário, desativar smooth CSS quando ScrollTrigger estiver ativo ou usar scrollTo do GSAP com cuidado.

---

### P3.3 — Lateral pin indicator (projetos)

**Referência:** [Lateral pin indicator](https://demos.gsap.com/demo/lateral-pin-indicator/)

**Onde:** [`projetos.component.*`](../src/app/components/projetos/)

**Passos**

1. Markup: lista vertical de projetos + rail/indicador lateral (dots ou barra).
2. Pin do container de projetos no desktop.
3. Scrub da timeline que avança o indicador e destaca o card ativo conforme o progresso.
4. Dados continuam vindo de `projects.data.ts` (P1) + chaves i18n (P2).

**Esqueleto**

```ts
mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
  const sections = gsap.utils.toArray<HTMLElement>('.project-slide');
  sections.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) setActiveIndex(i); // signal Angular
      },
    });
  });
});
```

**Aceite:** indicador lateral reflete o projeto em viewport; teclado/leitor de tela ainda navegam links dos projetos; reduced-motion = lista estática.

---

### P3.4 — Footer bounce (cores do projeto)

**Referência:** [Footer bounce](https://demos.gsap.com/demo/footer-bounce/)

**Onde:** [`footer.component.*`](../src/app/components/footer/) + tokens P0

**Passos**

1. Visual do footer com `--color-panel` / `--color-accent` (não cinza genérico apenas).
2. Animação de entrada no fim do documento (y / scale com ease elástico ou bounce controlado), tipicamente com ScrollTrigger no trigger do footer.
3. Evitar animar o próprio elemento `pin`ned de forma conflitante; animar filhos / wrapper interno.

```ts
gsap.from('.footer-inner', {
  yPercent: 40,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: 'footer',
    start: 'top bottom',
    end: 'top 60%',
    scrub: true,
  },
});
```

Ajustar curva para “bounce” conforme a demo (timeline + overshoot).

**Aceite:** ao chegar no fim, footer revela com presença; cores = tokens do projeto; reduced-motion = estado final estático.

---

### P3.5 — Hero presence

**Onde:** header `#inicio` na home.

**Passos**

1. Entrada simples: nome, cargo, CTAs com stagger (`from` opacity/y).
2. Sem overlays/badges flutuantes no hero.
3. Respeitar reduced-motion.

**Aceite:** primeira viewport com 1 composição clara + motion sutil.

---

### P3.6 — Checklist GSAP Angular

- [ ] Animações criadas só após view init  
- [ ] Selectors scoped no host do componente / `gsap.context(rootEl)`  
- [ ] `revert()` no destroy  
- [ ] `ScrollTrigger.refresh()` após troca de idioma (altura de texto muda)  
- [ ] Sem markers em produção  

---

## P4 — Recrutador / polish

### P4.1 — Contato ponta a ponta

**Arquivos**

- [`src/app/components/contato/contato.component.ts`](../src/app/components/contato/contato.component.ts) — hoje posta `application/x-www-form-urlencoded` em `/` com campo `body` e trata 404 como sucesso
- [`netlify/functions/contact.js`](../netlify/functions/contact.js) — espera **JSON** em `POST`, campo **`mensagem`**, rota `/.netlify/functions/contact`

**Passos**

1. Alinhar payload:

```ts
this.http.post('/.netlify/functions/contact', {
  nome, email, assunto, mensagem: this.contactForm.value.body,
})
```

2. Remover “404 = sucesso”.
3. Descomentar `<app-contato>` em [`home.page.html`](../src/app/pages/home/home.page.html) e import em `home.page.ts`.
4. Reativar link Contato na nav.
5. Configurar `RESEND_API_KEY` (e opcionalmente `CONTACT_TO_EMAIL`) no Netlify.
6. Traduzir labels via i18n.

**Aceite:** submit válido retorna 200 da function; erros mostram mensagem; sem falso positivo.

---

### P4.2 — SEO estruturado

1. JSON-LD `Person` em `index.html` ou injetado na `HomePage`.
2. Criar `src/assets/images/og-image.png` (1200×630) e apontar `og:image` / `twitter:image`.
3. Atualizar `lastmod` em [`src/sitemap.xml`](../src/sitemap.xml).

**Aceite:** validadores OG/JSON-LD sem erro crítico.

---

### P4.3 — A11y

1. Em `index.html`, viewport **sem** `user-scalable=no`.
2. Links `target="_blank"` com `rel="noopener noreferrer"` (incl. footer).
3. Emojis decorativos com `aria-hidden="true"`.
4. Botão do menu: `aria-controls` apontando ao painel.
5. Rodar axe/Lighthouse mental checklist.

**Aceite:** zoom funciona; sem warnings óbvios de target/_blank; menu anunciável.

---

### P4.4 — Tema dark

**Escolher um e documentar:**

- **A)** Implementar dark com tokens (`[data-theme="dark"]`) + toggle, ou  
- **B)** Remover `color-scheme: light dark` de qualquer meta e manter light-only honesto.

Hoje `global.scss` força light; não deixar promessa quebrada.

---

## Ordem estrita de execução (checklist mestre)

1. [ ] P0.1 Assets  
2. [ ] P0.2 Tokens  
3. [ ] P0.3 Specs  
4. [ ] P0.4 Wrangler → `www`  
5. [ ] P0.5 README sync  
6. [ ] P1.1 Models + data + `#educacao`  
7. [ ] P1.2 Narrativa Ionic/Capacitor  
8. [ ] P2.1 LanguageService + JSON  
9. [ ] P2.2 Toggle nav  
10. [ ] P2.3 Wire seções + meta  
11. [ ] P3.1 Instalar/registrar GSAP  
12. [ ] P3.2 Pinned panels 100vw  
13. [ ] P3.3 Lateral pin indicator (projetos)  
14. [ ] P3.4 Footer bounce  
15. [ ] P3.5 Hero motion  
16. [ ] P4.1 Contato Function  
17. [ ] P4.2 JSON-LD + OG  
18. [ ] P4.3 A11y  
19. [ ] P4.4 Tema honesto  

---

## Critérios de pronto global

Ver seção correspondente em [`ROADMAP.md`](./ROADMAP.md) — “pronto para impressionar recrutador”.

Validação manual mínima antes de merge da P3/P4:

| Viewport | O que checar |
|----------|----------------|
| Desktop ≥1024 | Painéis pinned, indicador projetos, footer bounce |
| Tablet / mobile | Sem pin que trave scroll; nav e toggle idioma ok |
| `prefers-reduced-motion` | Sem scrub/pin pesado |
| PT e EN | Copy + meta + refresh ScrollTrigger |

---

## Referências

- Roadmap: [`ROADMAP.md`](./ROADMAP.md)  
- Ambiente cloud: [`AGENTS.md`](../AGENTS.md)  
- Demos GSAP:
  - https://demos.gsap.com/demo/footer-bounce/
  - https://demos.gsap.com/demo/pinned-panels-with-overscroll/
  - https://demos.gsap.com/demo/lateral-pin-indicator/
