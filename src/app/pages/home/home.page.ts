import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

import { NavComponent } from '../../components/nav/nav.component';
import { SobreComponent } from '../../components/sobre/sobre.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ExperienciaComponent } from '../../components/experiencia/experiencia.component';
import { ProjetosComponent } from '../../components/projetos/projetos.component';
import { EducacaoComponent } from '../../components/educacao/educacao.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { setupHeroEntrance, setupPinnedPanels } from '../../core/gsap/home.animations';
import { ensureGsapRegistered, ScrollTrigger } from '../../core/gsap/register';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavComponent,
    RouterLink,
    SobreComponent,
    SkillsComponent,
    ExperienciaComponent,
    ProjetosComponent,
    EducacaoComponent,
    FooterComponent,
    TranslatePipe,
  ],
})
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly language = inject(LanguageService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private gsapCtx?: ReturnType<typeof gsap.context>;
  private motionCleanup?: () => void;

  constructor() {
    effect(() => {
      if (!this.language.ready()) {
        return;
      }

      this.language.lang();
      this.title.setTitle(this.language.t('seo.title'));
      this.meta.updateTag({ name: 'description', content: this.language.t('seo.description') });
      this.meta.updateTag({ property: 'og:title', content: this.language.t('seo.title') });
      this.meta.updateTag({ property: 'og:description', content: this.language.t('seo.description') });
      this.meta.updateTag({ name: 'twitter:title', content: this.language.t('seo.title') });
      this.meta.updateTag({ name: 'twitter:description', content: this.language.t('seo.description') });

      queueMicrotask(() => ScrollTrigger.refresh());
    });
  }

  ngAfterViewInit(): void {
    const gsap = ensureGsapRegistered();
    const root = this.elementRef.nativeElement;

    this.gsapCtx = gsap.context(() => {
      const heroCleanup = setupHeroEntrance(root, gsap);
      const panelsCleanup = setupPinnedPanels(root, gsap);

      this.motionCleanup = () => {
        heroCleanup?.();
        panelsCleanup();
      };
    }, root);
  }

  ngOnDestroy(): void {
    this.motionCleanup?.();
    this.gsapCtx?.revert();
  }
}
