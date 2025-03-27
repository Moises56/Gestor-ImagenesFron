// src/app/components/change-password/change-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChangePasswordRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Current Password -->
        <div>
          <label
            for="currentPassword"
            class="block text-sm font-medium text-gray-700"
          >
            Contraseña Actual
          </label>
          <input
            id="currentPassword"
            type="password"
            [(ngModel)]="changePasswordRequest.currentPassword"
            name="currentPassword"
            required
            minlength="6"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <!-- New Password -->
        <div>
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700"
          >
            Nueva Contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            [(ngModel)]="changePasswordRequest.newPassword"
            name="newPassword"
            required
            minlength="6"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p class="mt-1 text-sm text-gray-500">
            La contraseña debe tener al menos 6 caracteres.
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            [disabled]="
              !changePasswordRequest.currentPassword ||
              !changePasswordRequest.newPassword
            "
          >
            Cambiar Contraseña
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class ChangePasswordComponent {
  changePasswordRequest: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
  };

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.changePasswordRequest.newPassword.length < 6) {
      this.toastr.error(
        'La nueva contraseña debe tener al menos 6 caracteres.',
        'Error'
      );
      return;
    }

    this.authService.changePassword(this.changePasswordRequest).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Éxito');
        this.authService.logout(); // Log out after password change for security
        this.router.navigate(['/login']);
      },
      error: (err) => {
        let errorMessage = 'Error al cambiar la contraseña.';
        if (err.status === 400) {
          errorMessage = 'La contraseña actual es incorrecta.';
        } else if (err.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }
}
