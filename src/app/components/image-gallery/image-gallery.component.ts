// src/app/components/image-gallery/image-gallery.component.ts
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Image, PaginatedResponse } from '../../interfaces/image.interface';
import { User } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})
export class ImageGalleryComponent implements OnInit {
  @Output() onDelete = new EventEmitter<Image>();
  @Output() onEdit = new EventEmitter<Image>();
  @Output() onAddNew = new EventEmitter<void>();

  images: Image[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  hasMore: boolean = false;
  currentUser: User | null = null;

  constructor(
    private imageService: ImageService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadImages();
      } else {
        this.toastr.error(
          'Por favor, inicia sesión para ver tus imágenes.',
          'No autenticado'
        );
        this.router.navigate(['/login']);
      }
    });
  }

  loadImages(page: number = 1): void {
    this.currentPage = page;
    this.imageService.getUserImages(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Image>) => {
        console.log('Loaded images:', response.data);
        this.images = response.data || [];
        this.totalPages = response.pagination.totalPages || 1;
        this.currentPage = response.pagination.page || 1;
        this.hasMore = response.pagination.hasMore || false;
        this.cdr.detectChanges(); // Force change detection
        if (this.images.length === 0) {
          this.toastr.info('No tienes imágenes subidas.', 'Información');
        }
      },
      error: (error) => {
        console.error('Error al cargar imágenes:', error);
        if (error.status === 401) {
          this.toastr.error(
            'Sesión expirada. Por favor, inicia sesión nuevamente.',
            'No autenticado'
          );
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(
            error.message || 'Error al cargar las imágenes.',
            'Error'
          );
        }
      },
    });
  }

  copyUrl(url: string): void {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.toastr.success('URL copiada al portapapeles!', 'Éxito', {
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
        });
      })
      .catch((err) => {
        this.toastr.error('Error al copiar la URL', 'Error');
        console.error('Error al copiar la URL:', err);
      });
  }

  handleAddNew(): void {
    this.onAddNew.emit();
  }

  isOwner(image: Image): boolean {
    if (!this.currentUser) {
      return false;
    }
    return image.userId === this.currentUser.id;
  }

  get isAdminOrModerator(): boolean {
    if (!this.currentUser) {
      return false;
    }
    return (
      this.currentUser.role === 'ADMIN' || this.currentUser.role === 'MODERATOR'
    );
  }

  deleteImage(image: Image) {
    this.onDelete.emit(image);
  }

  refresh() {
    this.currentPage = 1;
    this.loadImages();
  }
}
