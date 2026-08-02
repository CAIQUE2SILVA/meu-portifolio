import { Component } from '@angular/core';
import { SKILL_CATEGORIES } from '../../data/skills.data';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  readonly categories = SKILL_CATEGORIES;
}
