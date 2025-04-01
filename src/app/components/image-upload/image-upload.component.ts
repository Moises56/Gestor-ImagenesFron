// src/app/components/image-upload/image-upload.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from '../../services/image.service';
import { ImageUploadRequest } from '../../interfaces/image.interface';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Subir Nueva Imagen
      </h2>
      <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Name Input -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la imagen
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="Ej. Mi Imagen Favorita"
            [class.border-red-500]="
              uploadForm.get('name')?.invalid && uploadForm.get('name')?.touched
            "
          />
          <p
            *ngIf="
              uploadForm.get('name')?.invalid && uploadForm.get('name')?.touched
            "
            class="text-red-500 text-xs mt-1"
          >
            El nombre es obligatorio
          </p>
        </div>

        <!-- Description Input -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
            placeholder="Describe tu imagen (opcional)"
          ></textarea>
        </div>

        <!-- File Upload with Drag-and-Drop -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Imagen
          </label>
          <div
            class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors duration-200"
            [class.border-indigo-500]="isDragging"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
          >
            <input
              type="file"
              (change)="onFileSelected($event)"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div *ngIf="!selectedFile" class="flex flex-col items-center">
              <svg
                class="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-gray-500">
                Arrastra y suelta tu imagen aquí o
                <span class="text-indigo-600 hover:underline cursor-pointer"
                  >selecciona un archivo</span
                >
              </p>
            </div>
            <!-- Image Preview -->
            <div *ngIf="selectedFile" class="flex flex-col items-center">
              <img
                [src]="imagePreview"
                alt="Preview"
                class="max-h-48 rounded-lg mb-2 object-cover"
              />
              <p class="text-gray-600 text-sm">{{ selectedFile.name }}</p>
              <button
                type="button"
                (click)="clearFile()"
                class="text-red-500 text-sm hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="uploadForm.invalid || !selectedFile || isLoading"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span *ngIf="isLoading" class="flex items-center justify-center">
            <svg
              class="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Subiendo...
          </span>
          <span *ngIf="!isLoading">Subir imagen</span>
        </button>
      </form>
    </div>
  `,
})
export class ImageUploadComponent {
  @Output() uploaded = new EventEmitter<void>();

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  isDragging = false;

  constructor(
    private fb: FormBuilder,
    private imageService: ImageService,
    private toastr: ToastrService
  ) {
    this.uploadForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.generateImagePreview();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.generateImagePreview();
      } else {
        this.toastr.error(
          'Por favor, selecciona un archivo de imagen.',
          'Error'
        );
      }
    }
  }

  generateImagePreview() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  clearFile() {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = ''; // Reset the file input
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isLoading = true;
      const formData: ImageUploadRequest = {
        file: this.selectedFile,
        name: this.uploadForm.get('name')?.value,
        description: this.uploadForm.get('description')?.value,
      };

      this.imageService.uploadImage(formData).subscribe({
        next: (response) => {
          console.log('Image uploaded successfully:', response);
          this.toastr.success('Imagen subida exitosamente');
          this.uploaded.emit();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          let errorMessage = 'Error al subir la imagen';
          
          if (error.message.includes('File too large')) {
            errorMessage = 'La imagen es demasiado grande. Por favor, elige una imagen más pequeña.';
          } else if (error.message.includes('Unsupported file type')) {
            errorMessage = 'Tipo de archivo no soportado. Por favor, sube una imagen válida.';
          } else if (error.message.includes('Authentication error')) {
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.toastr.error(errorMessage);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.error('Por favor, completa todos los campos requeridos');
      Object.keys(this.uploadForm.controls).forEach(key => {
        const control = this.uploadForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  private resetForm() {
    this.uploadForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.isLoading = false;
  }
}
