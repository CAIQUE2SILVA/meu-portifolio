import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  NgZone,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { NavComponent } from '../../components/nav/nav.component';
import { SobreComponent } from '../../components/sobre/sobre.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ExperienciaComponent } from '../../components/experiencia/experiencia.component';
import { ProjetosComponent } from '../../components/projetos/projetos.component';
import { EducacaoComponent } from '../../components/educacao/educacao.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {
  setupFooterContent,
  setupFooterReveal,
} from '../../core/gsap/footer.animations';
import {
  setupHeroEntrance,
  setupHeroParallax,
  setupMagneticButtons,
  setupScrollProgress,
  setupSectionReveals,
} from '../../core/gsap/home.animations';
import {
  setupProjectCardPointer,
  setupProjectsShowcase,
} from '../../core/gsap/projetos.animations';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '../../core/gsap/register';
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
export class HomePage implements OnDestroy {
  @ViewChild(ProjetosComponent) private readonly projetosCmp?: ProjetosComponent;

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly language = inject(LanguageService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private readonly injector = inject(Injector);

  private readonly viewReady = signal(false);

  private gsapCtx?: ReturnType<typeof gsap.context>;
  private pendingInit = 0;
  private initGeneration = 0;

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
    });

    // SplitText measures line boxes, so it can only run once the dictionary has
    // been applied to the DOM — and it has to run again on every language swap.
    effect(() => {
      if (!this.viewReady() || !this.language.ready()) {
        return;
      }

      this.language.lang();
      this.scheduleGsapInit();
    });

    afterNextRender(() => this.viewReady.set(true), { injector: this.injector });
  }

  private scheduleGsapInit(): void {
    cancelAnimationFrame(this.pendingInit);
    this.initGeneration += 1;
    const generation = this.initGeneration;

    this.pendingInit = requestAnimationFrame(() => {
      const fonts = document.fonts;

      if (fonts) {
        void fonts.ready.then(() => {
          if (generation !== this.initGeneration) {
            return;
          }
          this.initGsap();
        });
        return;
      }

      this.initGsap();
    });
  }

  private initGsap(): void {
    this.ngZone.runOutsideAngular(() => {
      const gsapInstance = ensureGsapRegistered();
      const root = this.elementRef.nativeElement as HTMLElement;
      const projetosRoot = root.querySelector('app-projetos') as HTMLElement | null;
      const footerRoot = root.querySelector('app-footer') as HTMLElement | null;
      const projetosCmp = this.projetosCmp;

      this.gsapCtx?.revert();
      this.gsapCtx = gsapInstance.context(() => {
        setupScrollProgress(root, gsapInstance);
        setupHeroEntrance(root, gsapInstance);
        setupHeroParallax(root, gsapInstance);
        setupSectionReveals(root, gsapInstance);
        setupMagneticButtons(root, gsapInstance);

        if (projetosRoot) {
          setupProjectCardPointer(projetosRoot, gsapInstance);

          if (projetosCmp) {
            setupProjectsShowcase(projetosRoot, gsapInstance, (index) => {
              this.ngZone.run(() => projetosCmp.setActiveIndex(index));
            });
          }
        }

        if (footerRoot) {
          setupFooterReveal(footerRoot, gsapInstance);
          setupFooterContent(footerRoot, gsapInstance);
        }
      }, root);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.pendingInit);
    this.gsapCtx?.revert();
    this.gsapCtx = undefined;
  }
}
