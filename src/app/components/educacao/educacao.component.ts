import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-educacao',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './educacao.component.html',
  styleUrl: './educacao.component.scss',
})
export class EducacaoComponent {}
