import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18N_TEST_PROVIDERS } from '../../core/i18n/i18n.testing';
import { EducacaoComponent } from './educacao.component';

describe('EducacaoComponent', () => {
  let component: EducacaoComponent;
  let fixture: ComponentFixture<EducacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducacaoComponent],
      providers: I18N_TEST_PROVIDERS,
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
