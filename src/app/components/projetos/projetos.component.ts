import { Component } from '@angular/core';
import { PROJECTS } from '../../data/projects.data';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './projetos.component.html',
  styleUrl: './projetos.component.scss',
})
export class ProjetosComponent {
  readonly projects = PROJECTS;
}
