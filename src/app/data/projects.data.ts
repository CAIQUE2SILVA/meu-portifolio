import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 'casamento-website',
    titleKey: 'casamento-website',
    stack: ['Angular + Firebase + Supabase'],
    descriptionKey:
      'Site de casamento com gestão de convidados e RSVP, integrando banco em tempo real.',
    implementationKey:
      'Frontend em Angular, autenticação/fluxos de convidados, persistência e atualizações em tempo real.',
    benefitKey:
      'Centraliza confirmação de presença e informações do evento, facilitando a organização.',
    repoUrl: 'https://github.com/CAIQUE2SILVA/casamento-website',
    demoUrl: 'https://kimillyekaua.netlify.app/',
  },
  {
    id: 'myperson',
    titleKey: 'MyPerson',
    stack: ['React · Angular · ASP.NET Core · Nginx · PostgreSQL · Docker'],
    descriptionKey:
      'Site full-stack com Docker Compose: frontend em React, painel admin em Angular, API em ASP.NET Core (C#), Nginx como reverse proxy e PostgreSQL.',
    implementationKey:
      'Estrutura com frontend (React), admin (Angular), api (ASP.NET Core) e nginx; roteamento via Nginx e orquestração com docker-compose.',
    benefitKey:
      'Prática de stack completa, múltiplos frontends e backend em .NET, com ambiente containerizado próximo ao de produção.',
    repoUrl: 'https://github.com/CAIQUE2SILVA/MyPerson',
  },
  {
    id: 'todolist-backend',
    titleKey: 'TODOLIST-BACKEND',
    stack: ['Node.js + TypeScript + Express'],
    descriptionKey:
      'API REST para gerenciamento de tarefas (CRUD), com foco em uma base “production ready”.',
    implementationKey:
      'Rotas e handlers em Express com TypeScript, estruturando endpoints para tarefas.',
    benefitKey: 'Backend reutilizável para apps de produtividade e integrações front-end.',
    repoUrl: 'https://github.com/CAIQUE2SILVA/TODOLIST-BACKEND',
  },
  {
    id: 'webapi',
    titleKey: 'WebApi',
    stack: ['ASP.NET Core + C#'],
    descriptionKey:
      'API REST em .NET para estudos e prática de backend: endpoints, modelos e boas práticas em C#.',
    implementationKey:
      'Projeto ASP.NET Core com controllers, rotas e estrutura pronta para integração.',
    benefitKey:
      'Base sólida em C#/.NET para evoluir para microsserviços ou consumo por front-end.',
    repoUrl: 'https://github.com/CAIQUE2SILVA/WebAPI',
  },
  {
    id: 'meu-portifolio',
    titleKey: 'meu-portifolio',
    stack: ['Angular'],
    descriptionKey: 'Meu portfólio pessoal (este site), com seções, links e contato.',
    implementationKey: 'Angular com componentes e estilos SCSS, deploy na Netlify.',
    benefitKey: 'Apresentação centralizada de experiência, skills e projetos.',
    repoUrl: 'https://github.com/CAIQUE2SILVA/meu-portifolio',
  },
];
