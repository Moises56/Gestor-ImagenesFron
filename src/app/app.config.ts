import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  withJsonpSupport,
} from '@angular/common/http';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withJsonpSupport()
    ),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
