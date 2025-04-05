import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.valion-admin-web-dark'
        }
      },
      ripple: true,
      inputVariant: 'filled',
    }),
    provideZoneChangeDetection({
       eventCoalescing: true
      }),
      provideRouter(routes),
      provideClientHydration(withEventReplay()),
      importProvidersFrom(FormsModule),
      provideHttpClient(withFetch())
    ]
};
