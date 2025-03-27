// src/app/pages/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div
        class="relative bg-gradient-to-r from-[#5ccedf] to-[#148799] overflow-hidden"
      >
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div class="text-center">
            <h1
              class="text-5xl md:text-6xl font-extrabold text-white tracking-tight"
            >
              <span class="block">Bienvenido a la Galería de Imágenes</span>
              <span class="block ">AMDC</span>
            </h1>
            <p
              class="mt-4 text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto"
            >
              Gestiona, sube y organiza tus imágenes de manera segura y privada
              con nuestra plataforma moderna y fácil de usar.
            </p>
            <div class="mt-8 flex justify-center gap-4">
              <a
                *ngIf="!(authService.user$ | async)"
                routerLink="/login"
                class="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-50 transition-colors duration-300"
              >
                Iniciar Sesión
              </a>
              <!-- <a
                *ngIf="!(authService.user$ | async)"
                routerLink="/register"
                class="inline-flex items-center px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-300"
              >
                Registrarse
              </a> -->
              <a
                *ngIf="authService.user$ | async"
                routerLink="/dashboard"
                class="inline-flex items-center px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-300"
              >
                Ir al Dashboard
              </a>
            </div>
          </div>
        </div>
        <div
          class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"
        ></div>
      </div>

      <!-- Features Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">AMDC</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4"
            >
              <svg
                class="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Sube Fácilmente
            </h3>
            <p class="text-gray-600">
              Sube tus imágenes con un simple arrastrar y soltar, y organízalas
              en tu galería personal.
            </p>
          </div>
          <!-- Feature 2 -->
          <div
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4"
            >
              <svg
                class="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m4-8V4m0 16v-2m-4 2v-2m0-12v2m8 4h2m-16 0H4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Privacidad Garantizada
            </h3>
            <p class="text-gray-600">
              Tus imágenes son privadas y solo tú puedes verlas, editarlas o
              eliminarlas.
            </p>
          </div>
          <!-- Feature 3 -->
          <div
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4"
            >
              <svg
                class="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Interfaz Moderna
            </h3>
            <p class="text-gray-600">
              Disfruta de una experiencia de usuario fluida con un diseño
              moderno y responsivo.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-indigo-600 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Comienza a gestionar tus imágenes!
          </h2>
          <p class="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">AMDC.</p>
          <a
            *ngIf="!(authService.user$ | async)"
            routerLink="/login"
            class="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-50 transition-colors duration-300"
          >
            Login
          </a>
          <a
            *ngIf="authService.user$ | async"
            routerLink="/dashboard"
            class="inline-flex items-center px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-300"
          >
            Ir al Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm">&copy;2025 AMDC. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
