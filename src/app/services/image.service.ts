// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError, tap, catchError } from 'rxjs';
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
      const timestamp = new Date().getTime();
      return this.http
        .get<PaginatedResponse<Image>>(
          `${this.apiUrl}?page=${page}&limit=${limit}&_=${timestamp}`,
          { headers }
        )
        .pipe(
          tap((response) => console.log('getUserImages response:', response)),
          map((response) => {
            if (!response.success) {
              throw new Error(response.message || 'Failed to fetch images');
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
          tap((response) => console.log('getImageById response:', response)),
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

      console.log('Uploading image with data:', {
        name: imageData.name,
        description: imageData.description,
        fileSize: imageData.file.size,
        fileType: imageData.file.type
      });

      return this.http
        .post<any>(`${this.apiUrl}/upload`, formData, { headers })
        .pipe(
          tap((response) => {
            console.log('Raw upload response:', response);
            if (!response) {
              throw new Error('Empty response from server');
            }
          }),
          map((response) => {
            // Handle different response formats
            if (response && response.data) {
              // Standard API response format
              if (!response.success) {
                console.error('Server returned error:', response.message);
                throw new Error(response.message || 'Failed to upload image');
              }
              return {
                ...response.data,
                url: this.ensureAbsoluteUrl(response.data.url),
              };
            } else if (response && response.id) {
              // Direct image object response
              return {
                ...response,
                url: this.ensureAbsoluteUrl(response.url),
              };
            } else if (response && response.error) {
              // Error response format
              console.error('Server returned error object:', response.error);
              throw new Error(response.error.message || 'Failed to upload image');
            }
            // If we get here, the response format is unexpected
            console.error('Unexpected response format:', response);
            throw new Error('Unexpected response format from server');
          }),
          catchError((error) => {
            console.error('Error in uploadImage:', error);
            if (error.status === 401) {
              throw new Error('Authentication error: Please log in again');
            }
            if (error.status === 413) {
              throw new Error('File too large. Please choose a smaller image.');
            }
            if (error.status === 415) {
              throw new Error('Unsupported file type. Please upload a valid image.');
            }
            throw new Error(error.error?.message || 'Failed to upload image');
          })
        );
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return throwError(() => error);
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
          tap((response) => console.log('updateImage response:', response)),
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
          tap((response) => console.log('deleteImage response:', response)),
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
