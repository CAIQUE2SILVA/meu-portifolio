# Meu Portfólio — Portfolio Profissional

Portfolio profissional interativo em **Angular 19** (standalone) para apresentar projetos, habilidades e experiência como desenvolvedor Full-Stack. Responsivo para mobile, tablet e desktop.

> A UI atual é Angular puro. Capacitor permanece no repo como bridge opcional; não há componentes Ionic na interface.

## Demonstração

**Acesse em:** [caique-portifolio.netlify.app](https://caique-portifolio.netlify.app/home)

## Stack do projeto

### Frontend
- **Angular 19** — SPA TypeScript standalone
- **TypeScript ~5.6** — tipagem estática
- **SCSS** — estilos por componente + tokens globais
- **Capacitor** (opcional) — bridge nativa; `webDir: www`

### Ferramentas
- **ESLint** — lint
- **Karma + Jasmine** — testes
- **Node.js 22** — runtime recomendado
- **Netlify** — hosting + function de contato
- **Cloudflare Workers** (Wrangler) — deploy alternativo dos assets estáticos

### Roadmap do redesign (alvo)
- **GSAP + ScrollTrigger** — painéis pinned, indicador lateral em projetos, footer bounce
- **i18n pt/en** — toggle runtime com dicionários JSON
- Estrutura `core/` · `data/` · `models/`

Documentação completa:

- [docs/ROADMAP.md](docs/ROADMAP.md) — priorização P0 → P4 (mais → menos necessário)
- [docs/GUIA-EXECUCAO.md](docs/GUIA-EXECUCAO.md) — passo a passo detalhado de cada etapa

## Funcionalidades atuais

- Página inicial com hero, CTAs (projetos, CV, WhatsApp)
- Seções: Sobre, Skills, Experiência, Projetos, Educação
- Navegação por fragmentos (`#projetos`, `#sobre`, …)
- SEO básico (meta, Open Graph, `robots.txt`, `sitemap.xml`)
- Design responsivo

> O formulário de contato existe no código, mas está desativado na home até alinhar com a Netlify Function (ver P4 no roadmap).

## Instalação

### Pré-requisitos
- Node.js 22+
- npm
- Angular CLI 19 (via `npx` / `node_modules`)

### Passos

```bash
git clone https://github.com/CAIQUE2SILVA/meu-portifolio.git
cd meu-portifolio
npm install
npm start
```

Acesse http://localhost:4200

## Execução

### Desenvolvimento
```bash
npm start
# ou
npx ng serve --port 4201
```

### Build para produção
```bash
npm run build
```

Saída em `www/` (Netlify e Wrangler).

### Testes
```bash
# local com Chrome
npx ng test

# headless (CI / cloud VM)
CHROME_BIN=$(which google-chrome-stable) npx ng test --watch=false --browsers=ChromeHeadless
```

### Lint
```bash
npm run lint
```

### Cloudflare Workers
```bash
npm run build
npm run preview   # wrangler dev
npm run deploy    # wrangler deploy
```

## Stack profissional (perfil)

**Frontend:** Angular, React/React Native, TypeScript, HTML5, CSS3/SCSS  
**Backend:** Node.js + Express, C# + .NET, REST APIs  
**Dados:** Firebase/Firestore, Supabase (PostgreSQL), SQL  
**DevOps:** Docker, GitHub, Netlify, Cloudflare

## Principais projetos

### 1. TodoList Backend
- REST API em TypeScript + Express.js
- https://github.com/CAIQUE2SILVA/TODOLIST-BACKEND

### 2. Casamento Website
- Site com Angular, Firebase, Supabase
- https://github.com/CAIQUE2SILVA/casamento-website

### 3. Google Books Search
- Integração com API Google Books
- https://github.com/CAIQUE2SILVA/Projeto-Busca-de-livros-

## Licença

MIT License — use este código como referência.

## Sobre mim

Desenvolvedor Full-Stack focado em experiências web de qualidade. Interesses:
- Frontend com Angular
- APIs com Node.js/TypeScript
- DevOps e Docker
- Infraestrutura e sistemas de ticketing (GLPI)
- Mentoria e compartilhamento de conhecimento

## Conecte-se

- LinkedIn: [Caique Nonato da Silva](https://www.linkedin.com/in/caique-nonato-da-silva-218aa988/)
- GitHub: [@CAIQUE2SILVA](https://github.com/CAIQUE2SILVA)
- Email: Caique2silva@gmail.com

## Contribuições

Sugestões e melhorias são bem-vindas:
- Reportar bugs via Issues
- Sugerir features
- Fork + Pull Requests

Para mudanças grandes de UX/motion/i18n, siga o [roadmap](docs/ROADMAP.md) e o [guia de execução](docs/GUIA-EXECUCAO.md).

---

**P.S.:** Se gostou, deixe uma estrela no repositório.
