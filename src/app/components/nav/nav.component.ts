import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Lang } from '../../core/i18n/lang.type';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  readonly language = inject(LanguageService);
  readonly mobileOpen = signal(false);

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  setLang(lang: Lang): void {
    this.language.setLang(lang);
  }
}
