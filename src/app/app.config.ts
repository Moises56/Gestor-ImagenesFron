// src/app/app.config.ts
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withJsonpSupport,
  HttpClientModule,
} from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr'; // Import provideToastr
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withJsonpSupport(),
      withInterceptors([authInterceptor])
    ),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideToastr({
      // Add Toastr configuration
      toastClass: 'ngx-toastr custom-toast',
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true,
      extendedTimeOut: 1000,
      enableHtml: true,
      messageClass: 'toast-message',
      titleClass: 'toast-title',
      onActivateTick: false,
      closeButton: true,
      newestOnTop: true,
      easing: 'ease-in',
      easeTime: 300,
      disableTimeOut: false,
    }),
    importProvidersFrom(HttpClientModule),
  ],
};
