import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, CreateUserRequest, AuthResponse } from '../models/user.model';
import { ApiResponse } from '../models/api.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.tokenValue && !!this.currentUserValue;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuth(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Login failed');
        }),
        catchError(this.handleError)
      );
  }

  register(userData: CreateUserRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuth(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Registration failed');
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuth();
        }),
        map(() => void 0),
        catchError((error) => {
          // Clear auth even if logout request fails
          this.clearAuth();
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.clearAuth();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setAuth(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Token refresh failed');
        }),
        catchError((error) => {
          this.clearAuth();
          return this.handleError(error);
        })
      );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Password reset request failed');
          }
          return void 0;
        }),
        catchError(this.handleError)
      );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/reset-password`, { token, newPassword })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Password reset failed');
          }
          return void 0;
        }),
        catchError(this.handleError)
      );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/profile`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            return response.data;
          }
          throw new Error(response.message || 'Profile update failed');
        }),
        catchError(this.handleError)
      );
  }

  private setAuth(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(authData.user));
    
    this.tokenSubject.next(authData.token);
    this.currentUserSubject.next(authData.user);
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('currentUser');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
