// src/app/interfaces/auth.interface.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    images: number;
  };
}

// New interfaces for password change requests and responses
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminChangePasswordRequest {
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  userId?: string; // Only included in admin response
}