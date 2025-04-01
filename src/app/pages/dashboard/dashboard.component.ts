// src/app/pages/dashboard/dashboard.component.ts
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ImageUploadComponent } from '../../components/image-upload/image-upload.component';
import { ImageGalleryComponent } from '../../components/image-gallery/image-gallery.component';
import { ImageEditComponent } from '../../components/app-image-edit/app-image-edit.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from '../users/users.component';
import { Image } from '../../interfaces/image.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ImageUploadComponent,
    ImageGalleryComponent,
    ImageEditComponent,
    ChangePasswordComponent,
    FormsModule,
    UsersComponent,
  ],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <div
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-transform duration-300 ease-in-out shadow-2xl"
        [ngClass]="{
          '-translate-x-full': !isSidebarOpen,
          'translate-x-0': isSidebarOpen
        }"
      >
        <!-- Sidebar Header -->
        <div
          class="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <img
              src="/assets/logo/logo2.png"
              alt="Logo"
              class="w-8 h-8 rounded-full"
            />
            <span class="text-lg sm:text-xl font-bold">Image Dashboard</span>
          </div>
          <button
            (click)="toggleSidebar()"
            class="p-2 text-gray-400 hover:text-white lg:hidden"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Sidebar Content -->
        <div class="flex flex-col h-[calc(100vh-64px)] sm:h-[calc(100vh-96px)]">
          <nav class="flex-1 p-4 space-y-4 overflow-y-auto">
            <!-- Section: Image Management -->
            <div>
              <h3
                class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2"
              >
                Gestión de Imágenes
              </h3>
              <a
                (click)="setActiveView('gallery')"
                class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors space-x-3"
                [ngClass]="{ 'bg-gray-700': activeView === 'gallery' }"
              >
                <svg
                  class="w-5 h-5 text-[#5ccedf] hover:text-[#4ab2c8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Mis Imágenes</span>
              </a>
              <a
                (click)="setActiveView('upload')"
                class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors space-x-3"
                [ngClass]="{ 'bg-gray-700': activeView === 'upload' }"
              >
                <svg
                  class="w-5 h-5 text-[#5ccedf] hover:text-[#4ab2c8]"
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
                <span>Subir Imagen</span>
              </a>
            </div>

            <!-- Section: User Management (ADMIN only) -->
            <div *ngIf="user?.role === 'ADMIN'">
              <h3
                class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2"
              >
                Gestión de Usuarios
              </h3>
              <a
                (click)="setActiveView('users')"
                class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors space-x-3"
                [ngClass]="{ 'bg-gray-700': activeView === 'users' }"
              >
                <svg
                  class="w-5 h-5 text-[#5ccedf] hover:text-[#4ab2c8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>Gestionar Usuarios</span>
              </a>
            </div>

            <!-- Section: Account Settings -->
            <div>
              <h3
                class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2"
              >
                Configuración de Cuenta
              </h3>
              <a
                (click)="setActiveView('change-password')"
                class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors space-x-3"
                [ngClass]="{ 'bg-gray-700': activeView === 'change-password' }"
              >
                <svg
                  class="w-5 h-5 text-[#5ccedf] hover:text-[#4ab2c8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-2H6m6 4v4m-6-4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                <span>Cambiar Contraseña</span>
              </a>
            </div>
          </nav>

          <!-- Logout Button -->
          <div class="p-4 border-t border-gray-700 bg-gray-800">
            <button
              (click)="logout()"
              class="w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Overlay for Mobile -->
      <div
        *ngIf="isSidebarOpen && !isDesktop"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        (click)="toggleSidebar()"
      ></div>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col transition-all duration-300"
        [ngClass]="{
          'ml-0': !isSidebarOpen || !isDesktop,
          'ml-64': isSidebarOpen && isDesktop
        }"
      >
        <!-- Header -->
        <header
          class="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10"
        >
          <div class="flex items-center space-x-4">
            <button
              (click)="toggleSidebar()"
              class="p-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h7"
                  *ngIf="!isSidebarOpen"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                  *ngIf="isSidebarOpen"
                />
              </svg>
            </button>
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">
              {{ getHeaderTitle() }}
            </h1>
          </div>
          <div class="relative">
            <button
              (click)="toggleDropdown()"
              class="flex items-center space-x-2 focus:outline-none"
            >
              <span class="text-sm sm:text-base text-gray-700 hidden sm:block">
                {{ userEmail || 'Admin' }}
              </span>
              <div
                class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
              >
                <span class="text-gray-600 font-semibold">
                  {{
                    userEmail ? (userEmail | slice : 0 : 1 | uppercase) : 'A'
                  }}
                </span>
              </div>
              <svg
                class="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              *ngIf="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20"
            >
              <div class="p-2 text-gray-700">
                <p class="text-sm font-medium">{{ userEmail || 'Admin' }}</p>
              </div>
              <div class="border-t border-gray-200"></div>
              <button
                (click)="logout()"
                class="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
          <div [ngSwitch]="activeView">
            <div *ngSwitchCase="'gallery'" class="space-y-6">
              <app-image-gallery
                #imageGallery
                (onDelete)="confirmDelete($event)"
                (onEdit)="openEditModal($event)"
                (onAddNew)="setActiveView('upload')"
              ></app-image-gallery>
            </div>
            <div *ngSwitchCase="'upload'" class="space-y-6">
              <app-image-upload
                (uploaded)="onImageUploaded()"
              ></app-image-upload>
            </div>
            <div *ngSwitchCase="'users'" class="space-y-6">
              <app-users></app-users>
            </div>
            <div *ngSwitchCase="'change-password'" class="space-y-6">
              <app-change-password></app-change-password>
            </div>
          </div>
        </main>
      </div>

      <!-- Edit Modal -->
      <div
        *ngIf="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-100"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Editar Imagen</h2>
            <button
              (click)="closeEditModal()"
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <app-image-edit
            [image]="selectedImage"
            (onClose)="closeEditModal()"
            (onSave)="onImageUpdated($event)"
          ></app-image-edit>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  @ViewChild('imageGallery') imageGallery?: ImageGalleryComponent;

  activeView: 'gallery' | 'upload' | 'users' | 'change-password' = 'gallery';
  showEditModal = false;
  selectedImage: Image | null = null;
  isSidebarOpen = false;
  isDropdownOpen = false;
  user: any = null;
  userEmail: string | null = null;

  constructor(
    public authService: AuthService,
    private imageService: ImageService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.userEmail = user?.email || null;
    });

    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setActiveView(view: 'gallery' | 'upload' | 'users' | 'change-password') {
    this.activeView = view;
  }

  getHeaderTitle(): string {
    switch (this.activeView) {
      case 'gallery':
        return 'Mis Imágenes';
      case 'upload':
        return 'Subir Imagen';
      case 'users':
        return 'Gestionar Usuarios';
      case 'change-password':
        return 'Cambiar Contraseña';
      default:
        return 'Dashboard';
    }
  }

  confirmDelete(image: Image) {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      this.imageService.deleteImage(image.id).subscribe({
        next: () => {
          this.toastr.success('Imagen eliminada correctamente', 'Éxito');
          if (this.imageGallery) {
            console.log('Refreshing gallery after delete');
            this.imageGallery.refresh();
          }
        },
        error: (err) => {
          this.toastr.error(
            err.message || 'Error al eliminar la imagen',
            'Error'
          );
        },
      });
    }
  }

  openEditModal(image: Image) {
    this.selectedImage = image;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedImage = null;
  }

  onImageUploaded() {
    this.toastr.success('Imagen subida correctamente', 'Éxito');
    this.setActiveView('gallery');
    setTimeout(() => {
      if (this.imageGallery) {
        console.log('Refreshing gallery after upload');
        this.imageGallery.refresh();
      }
    }, 0);
  }

  onImageUpdated(image: Image) {
    console.log('Image updated in DashboardComponent:', image);
    this.closeEditModal();
    if (this.imageGallery) {
      console.log('Refreshing gallery after update');
      this.imageGallery.refresh();
    }
  }

  logout() {
    this.authService.logout();
    this.toastr.info('Sesión cerrada', 'Hasta pronto');
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
  }

  get isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }

  checkScreenSize() {
    if (this.isDesktop) {
      this.isSidebarOpen = true;
    } else {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }
}
