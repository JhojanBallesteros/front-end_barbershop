import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Barber, BarberAvailability } from '../models/barber.model';
import { ApiResponse, PaginationParams, FilterParams } from '../models/api.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private readonly apiUrl = `${environment.apiUrl}/barbers`;

  constructor(private http: HttpClient) {}

  getBarbers(params?: PaginationParams & FilterParams): Observable<{ barbers: Barber[], total: number }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ barbers: Barber[], total: number }>>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch barbers');
        }),
        catchError(this.handleError)
      );
  }

  getBarberById(id: string): Observable<Barber> {
    return this.http.get<ApiResponse<Barber>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch barber');
        }),
        catchError(this.handleError)
      );
  }

  getBarberAvailability(barberId: string, date: Date): Observable<BarberAvailability> {
    const params = new HttpParams().set('date', date.toISOString().split('T')[0]);
    
    return this.http.get<ApiResponse<BarberAvailability>>(`${this.apiUrl}/${barberId}/availability`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch availability');
        }),
        catchError(this.handleError)
      );
  }

  getBarbersByService(serviceId: string): Observable<Barber[]> {
    const params = new HttpParams().set('serviceId', serviceId);
    
    return this.http.get<ApiResponse<Barber[]>>(`${this.apiUrl}/by-service`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch barbers for service');
        }),
        catchError(this.handleError)
      );
  }

  getTopRatedBarbers(limit: number = 5): Observable<Barber[]> {
    const params = new HttpParams()
      .set('sortBy', 'rating')
      .set('sortOrder', 'desc')
      .set('limit', limit.toString());
    
    return this.http.get<ApiResponse<{ barbers: Barber[] }>>(`${this.apiUrl}`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.barbers;
          }
          throw new Error(response.message || 'Failed to fetch top rated barbers');
        }),
        catchError(this.handleError)
      );
  }

  searchBarbers(query: string): Observable<Barber[]> {
    const params = new HttpParams().set('search', query);
    
    return this.http.get<ApiResponse<{ barbers: Barber[] }>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.barbers;
          }
          throw new Error(response.message || 'Failed to search barbers');
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
