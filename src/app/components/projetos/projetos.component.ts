import { Component } from '@angular/core';

import { PROJECTS } from '../../data/projects.data';
import { Project } from '../../models/project.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

interface ProjectSlide extends Project {
  /** Zero-padded position shown as the card watermark ("01", "02", …). */
  readonly label: string;
  /** Stack string exploded into individual chips. */
  readonly techs: string[];
}

function toSlide(project: Project, index: number): ProjectSlide {
  return {
    ...project,
    label: String(index + 1).padStart(2, '0'),
    techs: project.stack
      .join(' · ')
      .split(/[·+]/)
      .map((tech) => tech.trim())
      .filter(Boolean),
  };
}

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './projetos.component.html',
  styleUrl: './projetos.component.scss',
})
export class ProjetosComponent {
  readonly slides: ProjectSlide[] = PROJECTS.map(toSlide);
}
