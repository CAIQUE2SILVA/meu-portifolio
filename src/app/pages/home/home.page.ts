import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { NavComponent } from '../../components/nav/nav.component';
import { SobreComponent } from '../../components/sobre/sobre.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ExperienciaComponent } from '../../components/experiencia/experiencia.component';
import { ProjetosComponent } from '../../components/projetos/projetos.component';
import { EducacaoComponent } from '../../components/educacao/educacao.component';
// import { ContatoComponent } from '../../components/contato/contato.component';
import { FooterComponent } from '../../components/footer/footer.component';

const SEO = {
  title: 'Caique Nonato da Silva | Coordenador de TI & Desenvolvedor Angular',
  description: 'Portfólio de Caique Nonato da Silva — Coordenador de TI e Desenvolvedor com mais de 5 anos de experiência em Angular, TypeScript, Ionic, Front-end e Suporte Técnico. Confira projetos e currículo.',
};

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
    // ContatoComponent,
    FooterComponent,
  ]
})
export class HomePage implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle(SEO.title);
    this.meta.updateTag({ name: 'description', content: SEO.description });
  }
}
