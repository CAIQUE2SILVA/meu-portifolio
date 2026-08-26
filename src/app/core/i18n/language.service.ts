import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Lang } from './lang.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly dict = signal<Record<string, string>>({});

  readonly lang = signal<Lang>(this.readStored());
  /** Language whose dictionary is currently loaded in `dict`. */
  readonly loadedLang = signal<Lang | null>(null);
  readonly dictionary = this.dict.asReadonly();
  readonly ready = computed(() => Object.keys(this.dict()).length > 0);
  readonly contentSynced = computed(() => this.loadedLang() === this.lang());

  constructor(private readonly http: HttpClient) {
    this.load(this.lang());
  }

  t(key: string): string {
    return this.dict()[key] ?? key;
  }

  setLang(lang: Lang): void {
    if (lang === this.lang()) {
      return;
    }

    localStorage.setItem('portfolio.lang', lang);
    this.lang.set(lang);
    this.load(lang);
  }

  private readStored(): Lang {
    const stored = localStorage.getItem('portfolio.lang');
    return stored === 'en' ? 'en' : 'pt';
  }

  private load(lang: Lang): void {
    this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`).subscribe((dictionary) => {
      this.dict.set(dictionary);
      this.loadedLang.set(lang);
      document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    });
  }
}
