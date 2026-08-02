import { Component } from '@angular/core';
import { EXPERIENCES } from '../../data/experience.data';

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [],
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.scss',
})
export class ExperienciaComponent {
  readonly experiences = EXPERIENCES;
}
