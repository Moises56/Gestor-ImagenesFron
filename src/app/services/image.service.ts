// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment';

export interface ImageDto {
  id?: number;
  name: string;
  url: string;
  description?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  // private apiUrl = 'https://gestorimg.amdc.hn/images';
  private apiUrl = `${environment.apiUrl}/images`;
  private imageUploaded = new Subject<ImageDto>(); // Add Subject for real-time updates

  constructor(private http: HttpClient) {}

  uploadImage(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }

  getAllImages(): Observable<ImageDto[]> {
    return this.http.get<ImageDto[]>(this.apiUrl);
  }

  // Notify subscribers about new image
  notifyImageUploaded(image: ImageDto) {
    this.imageUploaded.next(image);
  }

  // Subscribe to new image uploads
  onImageUploaded(): Observable<ImageDto> {
    return this.imageUploaded.asObservable();
  }
}