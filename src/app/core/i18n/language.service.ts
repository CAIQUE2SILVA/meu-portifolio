import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Lang } from './lang.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly dict = signal<Record<string, string>>({});

  readonly lang = signal<Lang>(this.readStored());
  readonly ready = computed(() => Object.keys(this.dict()).length > 0);

  constructor(private readonly http: HttpClient) {
    this.load(this.lang());
  }

  t(key: string): string {
    return this.dict()[key] ?? key;
  }

  setLang(lang: Lang): void {
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
      document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    });
  }
}
