import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

export const I18N_TEST_PROVIDERS = [provideHttpClient(), provideHttpClientTesting()];
