// image-gallery.component.ts
import { Component, OnInit } from '@angular/core';
import {
  ImageService,
  ImageDto,
  PaginatedImages,
} from '../../services/image.service';
import { CommonModule } from '@angular/common';
import { FormularioImgComponent } from '../formulario-img/formulario-img.component';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, FormularioImgComponent],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})
export class ImageGalleryComponent implements OnInit {
  images: ImageDto[] = [];
  copiedImageId: number | null = null;
  showForm: boolean = false;
  editImage: ImageDto | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadImages();
    this.imageService.onImageUploaded().subscribe({
      next: (newImage) => {
        this.images.unshift(newImage);
      },
      error: (error) => console.error('Error en notificación:', error),
    });
  }

  loadImages(): void {
    this.imageService.getAllImages(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedImages) => {
        this.images = response.data;
        this.totalPages = response.totalPages;
      },
      error: (error) => console.error('Error al cargar imágenes:', error),
    });
  }

  copyUrl(image: ImageDto): void {
    if (image.url) {
      navigator.clipboard.writeText(image.url).then(
        () => {
          this.copiedImageId = image.id ?? null;
          setTimeout(() => (this.copiedImageId = null), 2000);
        },
        (err) => console.error('Failed to copy URL:', err)
      );
    }
  }

  toggleForm(image?: ImageDto): void {
    this.editImage = image || null;
    this.showForm = !this.showForm;
  }

  closeForm(): void {
    this.showForm = false;
    this.editImage = null;
  }

  deleteImage(id?: number): void {
    if (id && confirm('Are you sure you want to delete this image?')) {
      this.imageService.deleteImage(id).subscribe({
        next: () => {
          this.images = this.images.filter((img) => img.id !== id);
        },
        error: (error) => console.error('Error deleting image:', error),
      });
    }
  }

  changePage(delta: number): void {
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadImages();
    }
  }
}
