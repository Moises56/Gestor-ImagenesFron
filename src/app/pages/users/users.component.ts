// src/app/pages/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginatedResponse } from '../../interfaces/image.interface';
import {
  User,
  AdminChangePasswordRequest,
} from '../../interfaces/auth.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  passwordForm: FormGroup;
  searchForm: FormGroup;
  isModalOpen: boolean = false;
  isPasswordModalOpen: boolean = false;
  selectedUser: User | null = null;
  showPassword: boolean = false;
  showNewPassword: boolean = false; // Removed showOldPassword since it's not needed
  errorMessage: string | undefined = undefined;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Updated passwordForm to only include newPassword
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.searchForm = this.fb.group({
      searchName: [''],
      searchEmail: [''],
    });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'No estás autenticado. Por favor, inicia sesión.';
      this.router.navigate(['/login']);
      return;
    }

    this.authService.user$.subscribe((user) => {
      if (user?.role !== 'ADMIN') {
        this.errorMessage = 'No tienes permisos para acceder a esta página.';
        this.router.navigate(['/dashboard']);
        return;
      }
      this.loadUsers();
    });

    // Add search functionality with debounce
    this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.currentPage = 1; // Reset to first page on search
        this.loadUsers(value.searchName, value.searchEmail);
      });
  }

  loadUsers(name?: string, email?: string) {
    this.authService
      .getUsers(this.currentPage, this.pageSize, name, email)
      .subscribe({
        next: (response: PaginatedResponse<User>) => {
          if (!response) {
            console.error('Received empty response from server');
            this.users = [];
            this.totalPages = 1;
            this.currentPage = 1;
            return;
          }

          this.users = response.data || [];
          
          // Manejo seguro de la paginación
          if (response.pagination) {
            this.totalPages = response.pagination.totalPages || 1;
            this.currentPage = response.pagination.page || 1;
          } else {
            // Si no hay información de paginación, asumimos una página
            this.totalPages = 1;
            this.currentPage = 1;
          }

          if (this.users.length === 0) {
            this.toastr.info('No hay usuarios registrados.', 'Información');
          }
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.errorMessage =
            err.error?.message ||
            'Error al cargar los usuarios. Intenta de nuevo más tarde.';
          this.toastr.error(this.errorMessage || 'Error desconocido', 'Error');
          // En caso de error, establecemos valores por defecto
          this.users = [];
          this.totalPages = 1;
          this.currentPage = 1;
        },
      });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const { searchName, searchEmail } = this.searchForm.value;
    this.loadUsers(searchName, searchEmail);
  }

  openModal(user: User | null = null) {
    this.isModalOpen = true;
    this.selectedUser = user;
    this.showPassword = false;

    if (user) {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.userForm.reset();
      this.userForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.patchValue({ role: 'USER' });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.toastr.error(
        'Por favor, completa todos los campos correctamente.',
        'Error'
      );
      this.userForm.markAllAsTouched();
      return;
    }

    const data = this.userForm.value;
    if (this.selectedUser) {
      this.authService.updateUser(this.selectedUser.id, data).subscribe({
        next: (response) => {
          this.toastr.success('Usuario actualizado exitosamente.', 'Éxito');
          const { searchName, searchEmail } = this.searchForm.value;
          this.loadUsers(searchName, searchEmail);
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || 'Error al actualizar el usuario.',
            'Error'
          );
        },
      });
    } else {
      this.authService.register(data).subscribe({
        next: (response) => {
          this.toastr.success('Usuario creado exitosamente.', 'Éxito');
          const { searchName, searchEmail } = this.searchForm.value;
          this.loadUsers(searchName, searchEmail);
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || 'Error al crear el usuario.',
            'Error'
          );
        },
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.authService.deleteUser(id).subscribe({
        next: (response) => {
          this.toastr.success(
            response.message || 'Usuario eliminado exitosamente.',
            'Éxito'
          );
          const { searchName, searchEmail } = this.searchForm.value;
          this.loadUsers(searchName, searchEmail);
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || 'Error al eliminar el usuario.',
            'Error'
          );
        },
      });
    }
  }

  openPasswordModal(user: User) {
    this.isPasswordModalOpen = true;
    this.selectedUser = user;
    this.showNewPassword = false;
    this.passwordForm.reset();
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
    this.selectedUser = null;
    this.passwordForm.reset();
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.toastr.error(
        'Por favor, completa todos los campos correctamente.',
        'Error'
      );
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (!this.selectedUser?.id) {
      this.toastr.error('No se ha seleccionado un usuario.', 'Error');
      return;
    }

    const request: AdminChangePasswordRequest = {
      newPassword: this.passwordForm.value.newPassword,
    };

    this.authService
      .adminChangePassword(this.selectedUser.id, request)
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito');
          this.closePasswordModal();
        },
        error: (err) => {
          let errorMessage = 'Error al cambiar la contraseña.';
          if (err.status === 403) {
            errorMessage =
              'No tienes permisos para cambiar la contraseña de este usuario.';
          } else if (err.status === 400) {
            errorMessage = 'La nueva contraseña no cumple con los requisitos.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          this.toastr.error(errorMessage, 'Error');
        },
      });
  }

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }
}
