// src/app/components/formulario-img/formulario-img.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { ImageService, ImageDto } from '../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-img',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario-img.component.html',
  styleUrls: ['./formulario-img.component.css']
})
export class FormularioImgComponent {
  name: string = '';
  description: string = '';
  file: File | null = null;
  uploadSuccess: boolean = false;
  errorMessage: string = '';
  @Output() close = new EventEmitter<void>();

  constructor(private imageService: ImageService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.file || !this.name) {
      this.errorMessage = 'Name and file are required';
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('name', this.name);
    if (this.description) {
      formData.append('description', this.description);
    }
  
    this.imageService.uploadImage(formData).subscribe({
      next: (response) => {
        // console.log('URL devuelta por el backend:', response.url);
        const newImage: ImageDto = {
          name: this.name,
          url: response.url,
          description: this.description,
          createdAt: new Date(),
        };
        // Prueba la URL manualmente
        fetch(response.url)
          .then(res => console.log('Estado:', res.status))
          .catch(err => console.error('Error al acceder a la URL:', err));
        this.imageService.notifyImageUploaded(newImage);
        this.uploadSuccess = true;
        this.errorMessage = '';
        this.resetForm();
        setTimeout(() => this.close.emit(), 1000);
      },
      error: (error) => {
        this.errorMessage = 'Error uploading image';
        this.uploadSuccess = false;
        console.error('Error al subir:', error);
      },
    });
  }

  resetForm(): void {
    this.name = '';
    this.description = '';
    this.file = null;
    this.uploadSuccess = false;
  }
}