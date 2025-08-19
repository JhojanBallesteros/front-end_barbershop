import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Service, ServiceCategory, ServicePackage } from '../models/service.model';
import { ApiResponse, PaginationParams, FilterParams } from '../models/api.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(params?: PaginationParams & FilterParams): Observable<{ services: Service[], total: number }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ services: Service[], total: number }>>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch services');
        }),
        catchError(this.handleError)
      );
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch service');
        }),
        catchError(this.handleError)
      );
  }

  getServicesByCategory(category: ServiceCategory): Observable<Service[]> {
    const params = new HttpParams().set('category', category);
    
    return this.http.get<ApiResponse<{ services: Service[] }>>(`${this.apiUrl}`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.services;
          }
          throw new Error(response.message || 'Failed to fetch services by category');
        }),
        catchError(this.handleError)
      );
  }

  getServicesByBarber(barberId: string): Observable<Service[]> {
    const params = new HttpParams().set('barberId', barberId);
    
    return this.http.get<ApiResponse<Service[]>>(`${this.apiUrl}/by-barber`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch services for barber');
        }),
        catchError(this.handleError)
      );
  }

  getPopularServices(limit: number = 6): Observable<Service[]> {
    const params = new HttpParams()
      .set('sortBy', 'popularity')
      .set('sortOrder', 'desc')
      .set('limit', limit.toString());
    
    return this.http.get<ApiResponse<{ services: Service[] }>>(`${this.apiUrl}`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.services;
          }
          throw new Error(response.message || 'Failed to fetch popular services');
        }),
        catchError(this.handleError)
      );
  }

  searchServices(query: string): Observable<Service[]> {
    const params = new HttpParams().set('search', query);
    
    return this.http.get<ApiResponse<{ services: Service[] }>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.services;
          }
          throw new Error(response.message || 'Failed to search services');
        }),
        catchError(this.handleError)
      );
  }

  getServicePackages(): Observable<ServicePackage[]> {
    return this.http.get<ApiResponse<ServicePackage[]>>(`${this.apiUrl}/packages`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch service packages');
        }),
        catchError(this.handleError)
      );
  }

  getServiceCategories(): Observable<ServiceCategory[]> {
    return this.http.get<ApiResponse<ServiceCategory[]>>(`${this.apiUrl}/categories`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch service categories');
        }),
        catchError(this.handleError)
      );
  }

  calculateServicesDuration(serviceIds: string[]): Observable<number> {
    return this.http.post<ApiResponse<{ totalDuration: number }>>(`${this.apiUrl}/calculate-duration`, { serviceIds })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.totalDuration;
          }
          throw new Error(response.message || 'Failed to calculate duration');
        }),
        catchError(this.handleError)
      );
  }

  calculateServicesPrice(serviceIds: string[]): Observable<number> {
    return this.http.post<ApiResponse<{ totalPrice: number }>>(`${this.apiUrl}/calculate-price`, { serviceIds })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.totalPrice;
          }
          throw new Error(response.message || 'Failed to calculate price');
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}
