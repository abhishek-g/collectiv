import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@nx-angular-express/shared';
import { UserResponse, LoginUserInfo } from '@nx-angular-express/user-service';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  user: LoginUserInfo;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<HttpResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  signup(userData: SignupRequest): Observable<HttpResponse<UserResponse>> {
    console.log('Signup request:', userData);
    return this.http.post<HttpResponse<UserResponse>>(
      `${this.apiUrl}`,
      userData
    );
  }

  logout(): Observable<HttpResponse<null>> {
    return this.http.post<HttpResponse<null>>(`${this.apiUrl}/signout`, {});
  }

  getProfile(): Observable<HttpResponse<UserResponse>> {
    return this.http.get<HttpResponse<UserResponse>>(`${this.apiUrl}/profile`);
  }

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

