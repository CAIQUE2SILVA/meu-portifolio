# Checklist de Revisão — meu-portifolio

Use antes de propor cada commit parcial.

## Geral

- [ ] Commit tem **uma intenção** clara
- [ ] Nenhum segredo, token ou `.env`
- [ ] Nenhum artefato de build (`www/`, `dist/`)
- [ ] Sem `console.log` / debug deixado por engano
- [ ] Diff revisado linha a linha nos arquivos da parte

## TypeScript / Angular

- [ ] Imports corretos (standalone, paths do projeto)
- [ ] Tipos explícitos em `models/` e `data/`
- [ ] Lifecycle hooks com cleanup (GSAP: `context.revert()`, unsubscribes)
- [ ] Sem lógica duplicada entre componentes similares
- [ ] Specs incluídos quando o componente/service foi alterado de forma testável

## GSAP / Animações

- [ ] Plugins registrados em `register.ts`
- [ ] `gsap.matchMedia()` ou `motion-media.ts` para prefers-reduced-motion
- [ ] ScrollTrigger com `invalidateOnRefresh` quando layout muda
- [ ] Cleanup no destroy do componente

## i18n

- [ ] Chaves adicionadas em **pt.json e en.json**
- [ ] Pipe `translate` ou `LanguageService` usado consistentemente
- [ ] Sem strings hardcoded na UI quando deveriam ser traduzidas

## SCSS

- [ ] Tokens CSS existentes reutilizados (`var(--...)`)
- [ ] Escopo no componente; global só em `global.scss`
- [ ] Responsivo (mobile-first ou breakpoints do projeto)
- [ ] Sem valores mágicos duplicados — preferir tokens

## Config / deps

- [ ] Mudança em `package.json` justificada
- [ ] Lockfile (`package-lock.json`) incluído no mesmo commit
- [ ] Config Capacitor/Wrangler coerente com deploy (Netlify + Cloudflare)

## Testes (contexto AGENTS.md)

- [ ] Falhas conhecidas (`HomePage`, `NavComponent` sem `ActivatedRoute`) não atribuídas às mudanças atuais
- [ ] Novos testes ou fixes de spec incluídos no commit da feature relacionada

## Mensagem de commit

- [ ] Formato: `tipo(escopo): descrição`
- [ ] Descrição no imperativo, foco no porquê
- [ ] Escopo alinhado ao roadmap (P0–P4) ou área do código
