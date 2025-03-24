// src/app/components/image-gallery/image-gallery.component.ts
import { Component, OnInit } from '@angular/core';
import { ImageService, ImageDto } from '../../services/image.service';
import { CommonModule } from '@angular/common';
import { FormularioImgComponent } from '../formulario-img/formulario-img.component'; // Add this import

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, FormularioImgComponent], // Add FormularioImgComponent to imports
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})
export class ImageGalleryComponent implements OnInit {
  images: ImageDto[] = [];
  copiedImageId: number | null = null;
  showForm: boolean = false;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadImages();
    this.imageService.onImageUploaded().subscribe({
      next: (newImage) => {
        // console.log('Nueva imagen añadida:', newImage);
        newImage.url = `${newImage.url}?t=${Date.now()}`; // Evita caché
        this.images.unshift(newImage);
      },
      error: (error) => console.error('Error en notificación:', error),
    });
  }

  loadImages(): void {
    this.imageService.getAllImages().subscribe({
      next: (images) => {
        // console.log('Imágenes cargadas desde el backend:', images);
        this.images = images.map((img) => ({
          ...img,
          url: `${img.url}?t=${Date.now()}`, // Evita caché
        }));
        // Verifica accesibilidad de cada URL
        // images.forEach((img) => {
        //   fetch(img.url)
        //     .then((res) => console.log(`URL ${img.url}: ${res.status}`))
        //     .catch((err) => console.error(`Error en ${img.url}:`, err));
        // });
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

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}
