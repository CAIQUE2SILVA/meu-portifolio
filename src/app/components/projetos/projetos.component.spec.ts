import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18N_TEST_PROVIDERS } from '../../core/i18n/i18n.testing';
import { ProjetosComponent } from './projetos.component';

describe('ProjetosComponent', () => {
  let component: ProjetosComponent;
  let fixture: ComponentFixture<ProjetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetosComponent],
      providers: I18N_TEST_PROVIDERS,
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
