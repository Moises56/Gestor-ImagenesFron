// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Image,
  ImageUploadRequest,
  ImageUpdateRequest,
  PaginatedResponse,
  ApiResponse,
  ApiErrorResponse,
} from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private ensureAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${environment.apiUrl}${url}`;
  }

  getUserImages(
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<Image>> {
    try {
      const headers = this.getAuthHeaders();
      const timestamp = new Date().getTime(); // Cache-busting parameter
      return this.http
        .get<PaginatedResponse<Image>>(
          `${this.apiUrl}?page=${page}&limit=${limit}&_=${timestamp}`,
          { headers }
        )
        .pipe(
          map((response) => {
            if (!response.success) {
              throw new Error(response.message || 'Failed to fetch images'); // message is now optional
            }
            return {
              ...response,
              data: response.data.map((img) => ({
                ...img,
                url: this.ensureAbsoluteUrl(img.url),
              })),
            };
          })
        );
    } catch (error) {
      console.error('Error in getUserImages:', error);
      return throwError(
        () => new Error('Authentication error: No token found.')
      );
    }
  }

  getImageById(imageId: string): Observable<Image> {
    try {
      const headers = this.getAuthHeaders();
      return this.http
        .get<ApiResponse<Image>>(`${this.apiUrl}/${imageId}`, { headers })
        .pipe(
          map((response) => {
            if (!response.success || !response.data) {
              throw new Error(response.message || 'Failed to fetch image');
            }
            return {
              ...response.data,
              url: this.ensureAbsoluteUrl(response.data.url),
            };
          })
        );
    } catch (error) {
      console.error('Error in getImageById:', error);
      return throwError(
        () => new Error('Authentication error: No token found.')
      );
    }
  }

  uploadImage(imageData: ImageUploadRequest): Observable<Image> {
    try {
      const headers = this.getAuthHeaders();
      const formData = new FormData();
      formData.append('file', imageData.file);
      formData.append('name', imageData.name);
      if (imageData.description) {
        formData.append('description', imageData.description);
      }
      return this.http
        .post<ApiResponse<Image>>(`${this.apiUrl}/upload`, formData, {
          headers,
        })
        .pipe(
          map((response) => {
            if (!response.success || !response.data) {
              throw new Error(response.message || 'Failed to upload image');
            }
            return {
              ...response.data,
              url: this.ensureAbsoluteUrl(response.data.url),
            };
          })
        );
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return throwError(
        () => new Error('Authentication error: No token found.')
      );
    }
  }

  updateImage(
    imageId: string,
    imageData: ImageUpdateRequest
  ): Observable<Image> {
    try {
      const headers = this.getAuthHeaders();
      return this.http
        .put<ApiResponse<Image>>(`${this.apiUrl}/${imageId}`, imageData, {
          headers,
        })
        .pipe(
          map((response) => {
            if (!response.success || !response.data) {
              throw new Error(response.message || 'Failed to update image');
            }
            return {
              ...response.data,
              url: this.ensureAbsoluteUrl(response.data.url),
            };
          })
        );
    } catch (error) {
      console.error('Error in updateImage:', error);
      return throwError(
        () => new Error('Authentication error: No token found.')
      );
    }
  }

  deleteImage(imageId: string): Observable<{ message: string }> {
    try {
      const headers = this.getAuthHeaders();
      return this.http
        .delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${imageId}`, {
          headers,
        })
        .pipe(
          map((response) => {
            if (!response.success) {
              throw new Error(response.message || 'Failed to delete image');
            }
            return response.data || { message: 'Image deleted successfully' };
          })
        );
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return throwError(
        () => new Error('Authentication error: No token found.')
      );
    }
  }
}
