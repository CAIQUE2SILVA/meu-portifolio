import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PROJECTS } from '../../data/projects.data';
import { LanguageService } from '../i18n/language.service';
import { WebMcpModelContext } from './webmcp.types';

type ToolRegistration = {
  abort(): void;
};

@Injectable({ providedIn: 'root' })
export class WebMcpService {
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);
  private registrations: ToolRegistration[] = [];

  registerTools(): void {
    const modelContext = (navigator as Navigator & { modelContext?: WebMcpModelContext }).modelContext;
    if (!modelContext) {
      return;
    }

    this.unregisterTools();

    this.registrations = [
      modelContext.registerTool({
        name: 'navigate_to_section',
        description: 'Scroll to a portfolio section such as projetos, sobre, skills, experiencia, or educacao.',
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              enum: ['inicio', 'sobre', 'skills', 'experiencia', 'projetos', 'educacao'],
            },
          },
          required: ['section'],
        },
        execute: async (input: Record<string, unknown>) => {
          const section = String(input['section'] ?? 'inicio');
          await this.router.navigate(['/home'], { fragment: section });
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return { ok: true, section };
        },
      }),
      modelContext.registerTool({
        name: 'list_projects',
        description: 'Return featured public GitHub projects from the portfolio.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({
          projects: PROJECTS.map((project) => ({
            id: project.id,
            title: this.language.t(project.titleKey),
            stack: project.stack,
            description: this.language.t(project.descriptionKey),
            repoUrl: project.repoUrl,
            demoUrl: project.demoUrl ?? null,
          })),
        }),
      }),
      modelContext.registerTool({
        name: 'get_portfolio_summary',
        description: 'Return a short bilingual summary of the portfolio owner and current language.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({
          name: this.language.t('hero.name'),
          role: this.language.t('hero.role'),
          language: this.language.lang(),
          markdownUrl: '/portfolio.md',
          agentSkillsIndex: '/.well-known/agent-skills/index.json',
        }),
      }),
      modelContext.registerTool({
        name: 'set_language',
        description: 'Switch the portfolio UI language between Portuguese (pt) and English (en).',
        inputSchema: {
          type: 'object',
          properties: {
            language: { type: 'string', enum: ['pt', 'en'] },
          },
          required: ['language'],
        },
        execute: async (input: Record<string, unknown>) => {
          const nextLanguage = input['language'] === 'en' ? 'en' : 'pt';
          this.language.setLang(nextLanguage);
          return { ok: true, language: nextLanguage };
        },
      }),
    ];
  }

  unregisterTools(): void {
    for (const registration of this.registrations) {
      registration.abort();
    }
    this.registrations = [];
  }
}
