// image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from '@environments/environment';

export interface ImageDto {
  id?: number;
  name: string;
  url: string;
  description?: string;
  createdAt?: Date;
}

export interface PaginatedImages {
  data: ImageDto[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;
  private imageUploaded = new Subject<ImageDto>();

  constructor(private http: HttpClient) {}

  private ensureAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${environment.apiUrl}${url}`;
  }

  uploadImage(formData: FormData): Observable<ImageDto> {
    return this.http.post<ImageDto>(`${this.apiUrl}/upload`, formData).pipe(
      map(response => ({
        ...response,
        url: this.ensureAbsoluteUrl(response.url)
      }))
    );
  }

  getAllImages(page: number = 1, limit: number = 10): Observable<PaginatedImages> {
    return this.http.get<PaginatedImages>(`${this.apiUrl}?page=${page}&limit=${limit}`).pipe(
      map(response => ({
        ...response,
        data: response.data.map(img => ({
          ...img,
          url: this.ensureAbsoluteUrl(img.url)
        }))
      }))
    );
  }

  updateImage(id: number, image: Partial<ImageDto>): Observable<ImageDto> {
    return this.http.put<ImageDto>(`${this.apiUrl}/${id}`, image).pipe(
      map(response => ({
        ...response,
        url: this.ensureAbsoluteUrl(response.url)
      }))
    );
  }

  deleteImage(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  notifyImageUploaded(image: ImageDto) {
    this.imageUploaded.next(image);
  }

  onImageUploaded(): Observable<ImageDto> {
    return this.imageUploaded.asObservable();
  }
}