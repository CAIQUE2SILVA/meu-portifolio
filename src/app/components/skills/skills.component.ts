import { Component } from '@angular/core';
import { SKILL_CATEGORIES } from '../../data/skills.data';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  readonly categories = SKILL_CATEGORIES;
}
