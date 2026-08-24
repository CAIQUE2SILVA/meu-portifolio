import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';

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
  readonly totalLabel = String(PROJECTS.length).padStart(2, '0');

  readonly activeIndex = signal(0);
  readonly activeLabel = computed(() => String(this.activeIndex() + 1).padStart(2, '0'));

  private readonly cdr = inject(ChangeDetectorRef);

  /** Called from outside the Angular zone by the projects ScrollTrigger. */
  setActiveIndex(index: number): void {
    if (this.activeIndex() === index) {
      return;
    }
    this.activeIndex.set(index);
    this.cdr.markForCheck();
  }
}
