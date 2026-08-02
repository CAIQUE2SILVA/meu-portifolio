import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18N_TEST_PROVIDERS } from '../../core/i18n/i18n.testing';
import { ExperienciaComponent } from './experiencia.component';

describe('ExperienciaComponent', () => {
  let component: ExperienciaComponent;
  let fixture: ComponentFixture<ExperienciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienciaComponent],
      providers: I18N_TEST_PROVIDERS,
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
