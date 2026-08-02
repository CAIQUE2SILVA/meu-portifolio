import { SkillCategory } from '../models/skill.model';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    titleKey: 'Front-end',
    icon: '🚀',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'Ionic', 'React'],
  },
  {
    id: 'state',
    titleKey: 'Estado & Reatividade',
    icon: '🧠',
    skills: ['NgRx', 'RxJS', 'Signals', 'Acessibilidade (WCAG)', 'Performance (Lighthouse)'],
  },
  {
    id: 'backend',
    titleKey: 'Back-end & Plataforma (estudos)',
    icon: '🐳',
    skills: ['Node.js', 'Docker', 'C#'],
  },
  {
    id: 'tools',
    titleKey: 'Ferramentas',
    icon: '🛠️',
    skills: ['Git / GitHub', 'Figma', 'Firebase', 'VS Code', 'GLPI', 'Zabbix'],
  },
  {
    id: 'it-ops',
    titleKey: 'TI & Operações',
    icon: '🖥️',
    skills: [
      'Windows Server',
      'Active Directory',
      'Redes corporativas',
      'Service Desk (N1–N3)',
      'Gestão de SLAs',
      'Gestão de ativos',
      'ITIL',
    ],
  },
];
