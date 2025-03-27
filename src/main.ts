// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations'; // Add this import
import { provideToastr } from 'ngx-toastr'; // Add this for Toastr
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // If using HttpClient

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(), // Enable animations
    provideToastr({ timeOut: 3000, positionClass: 'toast-top-right' }), // Configure Toastr
    importProvidersFrom(HttpClientModule), // If using HttpClient
  ],
}).catch((err) => console.error(err));