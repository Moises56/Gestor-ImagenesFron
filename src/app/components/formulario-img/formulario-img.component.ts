// formulario-img.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule } from '@angular/forms';
import { ImageUploadRequest, Image } from '../../interfaces/image.interface';

@Component({
  selector: 'app-formulario-img',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario-img.component.html',
  styleUrls: ['./formulario-img.component.css'],
})
export class FormularioImgComponent {
  @Input() editImage: Image | null = null;
  @Output() close = new EventEmitter<void>();

  name: string = '';
  description: string = '';
  file: File | null = null;
  uploadSuccess: boolean = false;
  errorMessage: string = '';

  constructor(private imageService: ImageService) {}

  ngOnChanges(): void {
    if (this.editImage) {
      this.name = this.editImage.name;
      this.description = this.editImage.description || '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.name) {
      this.errorMessage = 'Name is required';
      return;
    }

    if (this.editImage && !this.file) {
      // Update existing image without new file
      this.imageService
        .updateImage(this.editImage.id!, {
          name: this.name,
          description: this.description,
        })
        .subscribe({
          next: () => {
            this.uploadSuccess = true;
            this.close.emit();
          },
          error: (error) => {
            this.errorMessage = 'Error updating image';
            console.error('Error al actualizar:', error);
          },
        });
    } else if (this.file) {
      // Create new image
      const imageData: ImageUploadRequest = {
        file: this.file,
        name: this.name,
        description: this.description || undefined,
      };

      this.imageService.uploadImage(imageData).subscribe({
        next: (response) => {
          this.uploadSuccess = true;
          this.errorMessage = '';
          this.resetForm();
          setTimeout(() => this.close.emit(), 1000);
        },
        error: (error) => {
          this.errorMessage = 'Error uploading image';
          console.error('Error al subir:', error);
        },
      });
    }
  }

  resetForm(): void {
    this.name = '';
    this.description = '';
    this.file = null;
    this.uploadSuccess = false;
  }
}
