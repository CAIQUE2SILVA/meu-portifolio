import { Component } from '@angular/core';
import { EXPERIENCES } from '../../data/experience.data';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.scss',
})
export class ExperienciaComponent {
  readonly experiences = EXPERIENCES;
}
