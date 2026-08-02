import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { NavComponent } from '../../components/nav/nav.component';
import { SobreComponent } from '../../components/sobre/sobre.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ExperienciaComponent } from '../../components/experiencia/experiencia.component';
import { ProjetosComponent } from '../../components/projetos/projetos.component';
import { EducacaoComponent } from '../../components/educacao/educacao.component';
import { FooterComponent } from '../../components/footer/footer.component';
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
export class HomePage {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly language = inject(LanguageService);

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
  }
}
