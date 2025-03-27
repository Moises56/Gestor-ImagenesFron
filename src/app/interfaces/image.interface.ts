// src/app/interfaces/image.interface.ts
export interface Image {
  id: string;
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ImageUploadRequest {
  file: File;
  name: string;
  description?: string;
}

export interface ImageUpdateRequest {
  name: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  message?: string; // Added optional message field
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}
