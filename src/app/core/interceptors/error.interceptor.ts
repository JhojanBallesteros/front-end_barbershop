import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        
        if (error.status === 403) {
          this.router.navigate(['/']);
          return throwError(() => new Error('Access denied'));
        }
        
        if (error.status === 0) {
          return throwError(() => new Error('Network error. Please check your connection.'));
        }
        
        const errorMessage = this.getErrorMessage(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/refresh')) {
      this.authService.logout().subscribe();
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Session expired'));
    }

    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const token = this.authService.tokenValue;
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authReq);
      }),
      catchError(() => {
        this.authService.logout().subscribe();
        this.router.navigate(['/auth/login']);
        return throwError(() => new Error('Session expired'));
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'Conflict. The resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `An error occurred (${error.status}). Please try again.`;
    }
  }
}
