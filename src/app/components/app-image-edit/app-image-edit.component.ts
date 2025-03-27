// src/app/components/app-image-edit/app-image-edit.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { ToastrService } from 'ngx-toastr';
import { Image, ImageUpdateRequest } from '../../interfaces/image.interface';

@Component({
  selector: 'app-image-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="save()" class="space-y-6">
      <!-- Image Preview -->
      <div class="flex justify-center">
        <img
          [src]="image?.url"
          [alt]="image?.name"
          class="w-48 h-48 object-cover rounded-lg shadow-md"
          (error)="handleImageError($event)"
        />
      </div>

      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Nombre</label
        >
        <input
          id="name"
          name="name"
          type="text"
          [(ngModel)]="updatedImage.name"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <!-- Description Field -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Descripción</label
        >
        <textarea
          id="description"
          name="description"
          [(ngModel)]="updatedImage.description"
          rows="3"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          (click)="onClose.emit()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Guardar
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class ImageEditComponent {
  @Input() image: Image | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Image>();

  updatedImage: ImageUpdateRequest = { name: '', description: '' };

  constructor(
    private imageService: ImageService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(): void {
    if (this.image) {
      this.updatedImage = {
        name: this.image.name,
        description: this.image.description || '',
      };
    }
  }

  save(): void {
    if (!this.image) {
      this.toastr.error(
        'No se puede actualizar la imagen. Imagen no encontrada.',
        'Error'
      );
      return;
    }

    this.imageService.updateImage(this.image.id, this.updatedImage).subscribe({
      next: (updatedImage) => {
        this.toastr.success('Imagen actualizada correctamente', 'Éxito');
        this.onSave.emit(updatedImage);
      },
      error: (err) => {
        console.error('Error updating image:', err);
        let errorMessage = 'Error al actualizar la imagen.';
        if (err.status === 403) {
          errorMessage = 'No tienes permisos para actualizar esta imagen.';
        } else if (err.status === 404) {
          errorMessage = 'La imagen no fue encontrada.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/fallback-image.png'; // Provide a fallback image
    this.toastr.warning('No se pudo cargar la imagen.', 'Advertencia');
  }
}
