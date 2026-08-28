#!/usr/bin/env node
/**
 * Generates agent-friendly Markdown from structured portfolio data.
 * Output: www/portfolio.md (served when clients send Accept: text/markdown)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN } from './agent-discovery.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'www');
const outFile = join(outDir, 'portfolio.md');

const pt = JSON.parse(readFileSync(join(root, 'src/assets/i18n/pt.json'), 'utf8'));
const en = JSON.parse(readFileSync(join(root, 'src/assets/i18n/en.json'), 'utf8'));

const PROJECTS = [
  {
    titleKey: 'projects.casamento.title',
    stack: ['Angular + Firebase + Supabase'],
    descriptionKey: 'projects.casamento.description',
    implementationKey: 'projects.casamento.implementation',
    benefitKey: 'projects.casamento.benefit',
    repoUrl: 'https://github.com/CAIQUE2SILVA/casamento-website',
    demoUrl: 'https://kimillyekaua.netlify.app/',
  },
  {
    titleKey: 'projects.myperson.title',
    stack: ['React · Angular · ASP.NET Core · Nginx · PostgreSQL · Docker'],
    descriptionKey: 'projects.myperson.description',
    implementationKey: 'projects.myperson.implementation',
    benefitKey: 'projects.myperson.benefit',
    repoUrl: 'https://github.com/CAIQUE2SILVA/MyPerson',
  },
  {
    titleKey: 'projects.todolist.title',
    stack: ['Node.js + TypeScript + Express'],
    descriptionKey: 'projects.todolist.description',
    implementationKey: 'projects.todolist.implementation',
    benefitKey: 'projects.todolist.benefit',
    repoUrl: 'https://github.com/CAIQUE2SILVA/TODOLIST-BACKEND',
  },
  {
    titleKey: 'projects.webapi.title',
    stack: ['ASP.NET Core + C#'],
    descriptionKey: 'projects.webapi.description',
    implementationKey: 'projects.webapi.implementation',
    benefitKey: 'projects.webapi.benefit',
    repoUrl: 'https://github.com/CAIQUE2SILVA/WebAPI',
  },
  {
    titleKey: 'projects.portifolio.title',
    stack: ['Angular'],
    descriptionKey: 'projects.portifolio.description',
    implementationKey: 'projects.portifolio.implementation',
    benefitKey: 'projects.portifolio.benefit',
    repoUrl: 'https://github.com/CAIQUE2SILVA/meu-portifolio',
  },
];

const SKILL_CATEGORIES = [
  { titleKey: 'skills.frontend.title', skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'Ionic', 'React'] },
  { titleKey: 'skills.state.title', skills: ['NgRx', 'RxJS', 'Signals', 'Acessibilidade (WCAG)', 'Performance (Lighthouse)'] },
  { titleKey: 'skills.backend.title', skills: ['Node.js', 'Docker', 'C#'] },
  { titleKey: 'skills.tools.title', skills: ['Git / GitHub', 'Figma', 'Firebase', 'VS Code', 'GLPI', 'Zabbix'] },
  { titleKey: 'skills.itops.title', skills: ['Windows Server', 'Active Directory', 'Redes corporativas', 'Service Desk (N1–N3)', 'Gestão de SLAs', 'Gestão de ativos', 'ITIL'] },
];

const EXPERIENCE = {
  roleKey: 'experience.exclusiva.role',
  company: 'Exclusiva',
  periodKey: 'experience.exclusiva.period',
  locationKey: 'experience.exclusiva.location',
  highlightKeys: [
    'experience.exclusiva.highlight.0',
    'experience.exclusiva.highlight.1',
    'experience.exclusiva.highlight.2',
    'experience.exclusiva.highlight.3',
    'experience.exclusiva.highlight.4',
  ],
};

const EDUCATION = [
  { titleKey: 'educacao.item1.title', institutionKey: 'educacao.item1.institution' },
  { titleKey: 'educacao.item2.title', institutionKey: 'educacao.item2.institution' },
  { titleKey: 'educacao.item3.title', institutionKey: 'educacao.item3.institution' },
];

const PROFILE_IMAGE = `${SITE_ORIGIN}/assets/images/profile.png`;

function stripHtml(text) {
  return text.replace(/<\/?strong>/g, '**').replace(/<[^>]+>/g, '');
}

function t(dict, key) {
  return stripHtml(dict[key] ?? key);
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function sectionForLocale(dict, locale) {
  const lines = [];

  lines.push(`## ${t(dict, 'hero.name')}`);
  lines.push('');
  lines.push(`**${t(dict, 'hero.role')}**`);
  lines.push('');
  lines.push(t(dict, 'hero.bio'));
  lines.push('');
  lines.push(`- Email: Caique2silva@gmail.com`);
  lines.push(`- LinkedIn: https://www.linkedin.com/in/caique-nonato-da-silva-218aa988/`);
  lines.push(`- GitHub: https://github.com/CAIQUE2SILVA`);
  lines.push(`- WhatsApp: https://wa.me/5511956386749`);
  lines.push('');

  lines.push(`## ${t(dict, 'sobre.title')}`);
  lines.push('');
  lines.push(t(dict, 'sobre.p1'));
  lines.push('');
  lines.push(t(dict, 'sobre.p2'));
  lines.push('');
  lines.push(t(dict, 'sobre.studying'));
  lines.push('');

  lines.push(`## ${t(dict, 'skills.title')}`);
  lines.push('');
  for (const category of SKILL_CATEGORIES) {
    lines.push(`### ${t(dict, category.titleKey)}`);
    lines.push('');
    lines.push(category.skills.map((skill) => `- ${skill}`).join('\n'));
    lines.push('');
  }

  lines.push(`## ${t(dict, 'experiencia.title')}`);
  lines.push('');
  lines.push(`### ${t(dict, EXPERIENCE.roleKey)} — ${EXPERIENCE.company}`);
  lines.push('');
  lines.push(`_${t(dict, EXPERIENCE.periodKey)} · ${t(dict, EXPERIENCE.locationKey)}_`);
  lines.push('');
  for (const key of EXPERIENCE.highlightKeys) {
    lines.push(`- ${t(dict, key)}`);
  }
  lines.push('');

  lines.push(`## ${t(dict, 'projetos.title')}`);
  lines.push('');
  lines.push(t(dict, 'projetos.subtitle'));
  lines.push('');
  for (const project of PROJECTS) {
    lines.push(`### ${t(dict, project.titleKey)}`);
    lines.push('');
    lines.push(`**Stack:** ${project.stack.join(', ')}`);
    lines.push('');
    lines.push(t(dict, project.descriptionKey));
    lines.push('');
    lines.push(`- **${t(dict, 'projetos.implementation')}:** ${t(dict, project.implementationKey)}`);
    lines.push(`- **${t(dict, 'projetos.benefit')}:** ${t(dict, project.benefitKey)}`);
    lines.push(`- **Repo:** ${project.repoUrl}`);
    if (project.demoUrl) {
      lines.push(`- **Demo:** ${project.demoUrl}`);
    }
    lines.push('');
  }

  lines.push(`## ${t(dict, 'educacao.title')}`);
  lines.push('');
  for (const item of EDUCATION) {
    lines.push(`- **${t(dict, item.titleKey)}** — ${t(dict, item.institutionKey)}`);
  }
  lines.push('');

  lines.push(`> Locale: ${locale}`);
  lines.push('');

  return lines.join('\n');
}

const frontmatter = `---
title: ${pt['seo.title']}
description: ${pt['seo.description']}
image: ${PROFILE_IMAGE}
---`;

const markdown = [
  frontmatter,
  '',
  '# Caique Nonato da Silva — Portfolio',
  '',
  'This document is a machine-readable summary of the portfolio site. The interactive UI is available at the canonical URL in HTML.',
  '',
  sectionForLocale(pt, 'pt-BR'),
  '---',
  '',
  sectionForLocale(en, 'en'),
].join('\n');

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, markdown, 'utf8');

const tokens = estimateTokens(markdown);
writeFileSync(join(outDir, 'portfolio.tokens'), String(tokens), 'utf8');

console.log(`Generated ${outFile} (~${tokens} tokens)`);
