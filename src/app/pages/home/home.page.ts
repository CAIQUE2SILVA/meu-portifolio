import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavComponent } from '../../components/nav/nav.component';
import { SobreComponent } from '../../components/sobre/sobre.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ExperienciaComponent } from '../../components/experiencia/experiencia.component';
import { ProjetosComponent } from '../../components/projetos/projetos.component';
import { EducacaoComponent } from '../../components/educacao/educacao.component';
// import { ContatoComponent } from '../../components/contato/contato.component';
import { FooterComponent } from '../../components/footer/footer.component';

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
export class HomePage {
}
