import { SkillCategory } from '../models/skill.model';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    titleKey: 'skills.frontend.title',
    icon: '🚀',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'Ionic', 'React'],
  },
  {
    id: 'state',
    titleKey: 'skills.state.title',
    icon: '🧠',
    skills: ['NgRx', 'RxJS', 'Signals', 'Acessibilidade (WCAG)', 'Performance (Lighthouse)'],
  },
  {
    id: 'backend',
    titleKey: 'skills.backend.title',
    icon: '🐳',
    skills: ['Node.js', 'Docker', 'C#'],
  },
  {
    id: 'tools',
    titleKey: 'skills.tools.title',
    icon: '🛠️',
    skills: ['Git / GitHub', 'Figma', 'Firebase', 'VS Code', 'GLPI', 'Zabbix'],
  },
  {
    id: 'it-ops',
    titleKey: 'skills.itops.title',
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
