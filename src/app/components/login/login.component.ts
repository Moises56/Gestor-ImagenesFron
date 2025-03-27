// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300"
      >
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img
            class="w-20 h-20 object-contain"
            src="/assets/logo/logo2.png"
            alt="Logo de la aplicación"
          />
        </div>
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico o nombre de usuario
            </label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5ccedf] focus:border-[#5ccedf] transition-all duration-200"
              placeholder="admin@amdc.hn"
              [class.border-red-500]="email?.invalid && email?.touched"
            />
            <div
              *ngIf="email?.invalid && email?.touched"
              class="text-red-500 text-xs mt-1"
            >
              <span *ngIf="email?.errors?.['required']">
                Por favor, ingresa un correo.
              </span>
              <span *ngIf="email?.errors?.['email']">
                Por favor, ingresa un correo válido.
              </span>
              <span *ngIf="hasEmailBackendError()">{{
                getEmailBackendError()
              }}</span>
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                formControlName="password"
                [type]="showPassword ? 'text' : 'password'"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5ccedf] focus:border-[#5ccedf] pr-10 transition-all duration-200"
                placeholder="••••••••"
                [class.border-red-500]="password?.invalid && password?.touched"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200"
                [attr.aria-label]="
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
                [attr.aria-pressed]="showPassword.toString()"
                id="toggle-password"
                [disabled]="!password?.value"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    [ngClass]="{
                      hidden: showPassword,
                      block: !showPassword
                    }"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    [ngClass]="{
                      hidden: !showPassword,
                      block: showPassword
                    }"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.5c-4.478 0-8.268 2.943-9.542 7 1.274 4.057 5.064 7 9.542 7s8.268-2.943 9.542-7c-1.274-4.057-5.064-7-9.542-7zM12 15a3 3 0 100-6 3 3 0 000 6z"
                  />
                </svg>
              </button>
            </div>
            <div
              *ngIf="password?.invalid && password?.touched"
              class="text-red-500 text-xs mt-1"
            >
              <span *ngIf="password?.errors?.['required']">
                Por favor, ingresa una contraseña.
              </span>
              <span *ngIf="hasPasswordBackendError()">{{
                getPasswordBackendError()
              }}</span>
            </div>
            <a
              href="#"
              class="text-sm text-[#5ccedf] hover:underline mt-2 inline-block transition-colors duration-200"
              (click)="forgotPassword($event)"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full p-3 bg-[#5ccedf] text-white rounded-lg hover:bg-[#4ab2c8] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <!-- Register Link -->
          <div class="text-sm text-center">
            <a
              routerLink="/register"
              class="font-medium text-[#5ccedf] hover:text-[#4ab2c8] transition-colors duration-200"
            >
              ¿No tienes cuenta? Regístrate
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toastr.success('Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          const errorMessage = error.message || 'Error al iniciar sesión';
          if (errorMessage.toLowerCase().includes('email')) {
            this.loginForm.get('email')?.setErrors({ backend: errorMessage });
          } else if (errorMessage.toLowerCase().includes('password')) {
            this.loginForm
              .get('password')
              ?.setErrors({ backend: errorMessage });
          } else {
            this.toastr.error(errorMessage, 'Error');
          }
          this.isLoading = false;
          this.loginForm.markAllAsTouched();
        },
      });
    } else {
      this.toastr.error(
        'Por favor, completa todos los campos correctamente.',
        'Error'
      );
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(event: Event): void {
    event.preventDefault();
    this.toastr.info('Funcionalidad no implementada aún.', 'Información');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  hasEmailBackendError(): boolean {
    return !!this.email?.errors && !!this.email.errors['backend'];
  }

  getEmailBackendError(): string {
    return this.email?.errors?.['backend'] || '';
  }

  hasPasswordBackendError(): boolean {
    return !!this.password?.errors && !!this.password.errors['backend'];
  }

  getPasswordBackendError(): string {
    return this.password?.errors?.['backend'] || '';
  }
}
