// src/app/services/auth.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { environment } from '@environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ChangePasswordRequest,
  AdminChangePasswordRequest,
  ChangePasswordResponse,
} from '../interfaces/auth.interface';
import { PaginatedResponse } from '../interfaces/image.interface';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  private isCheckingToken = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  private checkToken() {
    if (this.isCheckingToken) {
      console.log('checkToken already in progress, skipping');
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isCheckingToken = true;
        this.getProfile().subscribe({
          next: (user) => {
            console.log('Profile fetched successfully:', user);
            this.isCheckingToken = false;
          },
          error: (err) => {
            console.error('Error fetching profile on checkToken:', err);
            this.logout();
            this.router.navigate(['/login']);
            this.isCheckingToken = false;
          },
        });
      } else {
        console.log('No token found on checkToken');
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.access_token);
          }
          this.userSubject.next(response.user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  getProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() })
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
        }),
        catchError((err) => {
          console.error('Error in getProfile:', err);
          if (err.status === 401) {
            console.log('Unauthorized: Token may be invalid or expired');
            this.logout();
            this.router.navigate(['/login']);
          }
          throw err;
        })
      );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return (
      isPlatformBrowser(this.platformId) && !!localStorage.getItem('token')
    );
  }

  getUsers(
    page: number = 1,
    limit: number = 10,
    name?: string,
    email?: string
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (name) {
      params = params.set('name', name);
    }
    if (email) {
      params = params.set('email', email);
    }
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Updated method for user to change their own password
  
  changePassword(
    request: ChangePasswordRequest
  ): Observable<ChangePasswordResponse> {
    return this.http
      .put<ChangePasswordResponse>(`${this.apiUrl}/change-password`, request, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            console.log('Password changed successfully');
          }
        }),
        catchError((err) => {
          console.error('Error changing password:', err);
          throw err;
        })
      );
  }

  // New method for admin to change another user's password
  adminChangePassword(
    userId: string,
    request: AdminChangePasswordRequest
  ): Observable<ChangePasswordResponse> {
    return this.http
      .put<ChangePasswordResponse>(
        `${this.apiUrl}/users/${userId}/change-password`,
        request,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            console.log('Password changed successfully by admin');
          }
        }),
        catchError((err) => {
          console.error('Error changing password by admin:', err);
          throw err;
        })
      );
  }
}
