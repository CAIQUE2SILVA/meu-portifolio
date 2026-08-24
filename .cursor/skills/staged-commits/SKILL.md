---
name: staged-commits
description: Revisa mudanças locais por partes, aplica regras do projeto e boas práticas de commit, e gera resumo para confirmação do usuário antes de commitar. Use quando o usuário pedir commit, commits parciais, revisão antes de commit, ou mencionar /create-skill de commit.
---

# Commits por Partes com Revisão

## Princípios

1. **Nunca commitar sem confirmação explícita** do usuário para cada parte.
2. **Revisar antes de commitar** — agrupar, validar e apresentar resumo copiável.
3. **Um commit = uma intenção lógica** — não misturar refatoração, feature, fix e config no mesmo commit.
4. **Seguir o protocolo de segurança git** (ver abaixo).

## Fluxo obrigatório

### Fase 1 — Inventário

Executar em paralelo:

```bash
git status
git diff
git diff --staged
git log --oneline -10
```

Ler também `AGENTS.md` e, se existir, regras de commit do usuário/projeto.

### Fase 2 — Agrupar em partes

Dividir mudanças em commits lógicos. Ordem sugerida:

| Ordem | Tipo | Exemplos |
|-------|------|----------|
| 1 | Config/infra | `package.json`, `tsconfig`, `capacitor.config`, `wrangler.jsonc` |
| 2 | Models/data | `models/`, `data/` |
| 3 | Core/services | `core/`, i18n, GSAP register |
| 4 | Componentes | um componente ou seção por commit quando possível |
| 5 | Estilos globais | `global.scss`, tokens |
| 6 | Testes | specs relacionados ao commit anterior |
| 7 | Docs | `README`, `docs/` |

**Não incluir no commit:**
- Arquivos com segredos (`.env`, tokens, credenciais)
- Artefatos de build (`www/`, `dist/`, `node_modules/`)
- Mudanças acidentais ou debug (`console.log`, código comentado sem motivo)

### Fase 3 — Revisar cada parte

Para cada grupo, verificar [CHECKLIST.md](CHECKLIST.md).

Identificar problemas antes de propor commit:
- 🔴 **Bloqueador** — corrigir ou excluir do commit
- 🟡 **Sugestão** — mencionar, não bloquear
- 🟢 **OK** — pronto para commit

### Fase 4 — Resumo para confirmação

Para **cada parte**, gerar bloco copiável no formato abaixo. **Parar e aguardar** resposta do usuário antes de executar `git add` / `git commit`.

```markdown
---
## Commit [N/total]: [título curto]

### Arquivos
- `caminho/arquivo1.ts` — [criado|modificado|removido] — [1 linha do que mudou]
- `caminho/arquivo2.scss` — modificado — [1 linha do que mudou]

### Revisão
- [x] Escopo coeso (uma intenção)
- [x] Sem segredos ou artefatos de build
- [x] Segue convenção de mensagem do repo
- [ ] Problemas: [nenhum | listar]

### Mensagem proposta
```
tipo(escopo): descrição concisa

Corpo opcional explicando o porquê em 1-2 frases.
```

### Comando (executar só após confirmação)
git add [arquivos]
git commit -m "$(cat <<'EOF'
mensagem aqui

EOF
)"
---

**Confirma este commit?** Responda: `sim` / `não` / `ajustar: [feedback]`
```

### Fase 5 — Executar commit confirmado

Somente após `sim` ou confirmação equivalente:

1. `git add` apenas os arquivos da parte confirmada
2. Commit com HEREDOC (mensagem multilinha)
3. `git status` para verificar sucesso
4. Passar para a próxima parte ou encerrar com resumo final

Se hook de pre-commit modificar arquivos: corrigir e criar **novo** commit (nunca `--amend` salvo exceções do protocolo).

## Convenção de mensagem (meu-portifolio)

Seguir histórico do repo:

```
feat(Pn): descrição — detalhe opcional
fix(escopo): descrição
docs: descrição
refactor(escopo): descrição
chore: descrição
```

Regras:
- **Imperativo**, foco no **porquê**
- Escopo: fase do roadmap (`P0`–`P4`), componente ou área (`gsap`, `i18n`, `projetos`)
- 1–2 frases no corpo quando o título não bastar
- Português ou inglês — manter consistência com commits recentes da branch

Exemplos do repo:
- `feat(P3): GSAP ScrollTrigger — painéis, projetos e footer bounce`
- `feat(P2): i18n pt/en com LanguageService e toggle no nav`

## Protocolo de segurança git

- **NUNCA** alterar `git config`
- **NUNCA** `--force`, `hard reset`, `--no-verify` sem pedido explícito
- **NUNCA** force push em `main`/`master`
- **NUNCA** `commit --amend` salvo: pedido explícito + commit criado nesta sessão + não pushed
- **NUNCA** push sem pedido explícito
- **NUNCA** `git add -i` ou comandos interativos

## Resumo final (após todos os commits)

Quando todas as partes forem confirmadas e commitadas:

```markdown
## Commits criados

| # | Hash | Mensagem |
|---|------|----------|
| 1 | abc1234 | feat(P3): ... |
| 2 | def5678 | fix(footer): ... |

### Pendências (se houver)
- Arquivos não commitados: ...
- Sugestões de follow-up: ...
```

## Comportamento esperado

- Se houver muitas mudanças: apresentar **plano de partes** primeiro, depois detalhar parte a parte.
- Se o usuário disser "commita tudo": ainda dividir em partes lógicas e confirmar cada uma (ou pedir exceção explícita para commit único).
- Se encontrar bug óbvio durante revisão: reportar antes de commitar a parte afetada.
- Responder sempre em **português (Brasil)**.

## Referências do projeto

- [CHECKLIST.md](CHECKLIST.md) — checklist de revisão por tipo de arquivo
- [AGENTS.md](../../../AGENTS.md) — contexto do repo (Angular 19, lint, testes conhecidos)
