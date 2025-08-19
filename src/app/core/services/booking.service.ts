import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Booking, CreateBookingRequest, BookingStatus, BookingProgress } from '../models/booking.model';
import { ApiResponse, PaginationParams, FilterParams } from '../models/api.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/bookings`;
  private bookingProgressSubject = new BehaviorSubject<BookingProgress | null>(null);
  
  public bookingProgress$ = this.bookingProgressSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentBookingProgress(): BookingProgress | null {
    return this.bookingProgressSubject.value;
  }

  createBooking(bookingData: CreateBookingRequest): Observable<Booking> {
    return this.http.post<ApiResponse<Booking>>(`${this.apiUrl}`, bookingData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.clearBookingProgress();
            return response.data;
          }
          throw new Error(response.message || 'Failed to create booking');
        }),
        catchError(this.handleError)
      );
  }

  getBookings(params?: PaginationParams & FilterParams): Observable<{ bookings: Booking[], total: number }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ bookings: Booking[], total: number }>>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch bookings');
        }),
        catchError(this.handleError)
      );
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch booking');
        }),
        catchError(this.handleError)
      );
  }

  updateBookingStatus(id: string, status: BookingStatus, reason?: string): Observable<Booking> {
    const updateData = { status, ...(reason && { reason }) };
    
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}/${id}/status`, updateData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to update booking status');
        }),
        catchError(this.handleError)
      );
  }

  cancelBooking(id: string, reason: string): Observable<Booking> {
    return this.updateBookingStatus(id, BookingStatus.CANCELLED, reason);
  }

  rescheduleBooking(id: string, newDate: Date, newTime: string): Observable<Booking> {
    const rescheduleData = { date: newDate, startTime: newTime };
    
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}/${id}/reschedule`, rescheduleData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to reschedule booking');
        }),
        catchError(this.handleError)
      );
  }

  getUserBookings(userId: string, params?: PaginationParams & FilterParams): Observable<{ bookings: Booking[], total: number }> {
    let httpParams = new HttpParams().set('userId', userId);
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ bookings: Booking[], total: number }>>(`${this.apiUrl}/user`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch user bookings');
        }),
        catchError(this.handleError)
      );
  }

  getBarberBookings(barberId: string, date?: Date): Observable<Booking[]> {
    let httpParams = new HttpParams().set('barberId', barberId);
    
    if (date) {
      httpParams = httpParams.set('date', date.toISOString().split('T')[0]);
    }

    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/barber`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch barber bookings');
        }),
        catchError(this.handleError)
      );
  }

  checkAvailability(barberId: string, date: Date, startTime: string, duration: number): Observable<boolean> {
    const params = new HttpParams()
      .set('barberId', barberId)
      .set('date', date.toISOString().split('T')[0])
      .set('startTime', startTime)
      .set('duration', duration.toString());

    return this.http.get<ApiResponse<{ isAvailable: boolean }>>(`${this.apiUrl}/check-availability`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.isAvailable;
          }
          throw new Error(response.message || 'Failed to check availability');
        }),
        catchError(this.handleError)
      );
  }

  // Booking Progress Management
  initializeBookingProgress(): void {
    const initialProgress: BookingProgress = {
      currentStep: 1,
      steps: [
        { stepNumber: 1, title: 'Seleccionar Servicios', isCompleted: false, isActive: true },
        { stepNumber: 2, title: 'Elegir Barbero', isCompleted: false, isActive: false },
        { stepNumber: 3, title: 'Fecha y Hora', isCompleted: false, isActive: false },
        { stepNumber: 4, title: 'Información del Cliente', isCompleted: false, isActive: false },
        { stepNumber: 5, title: 'Confirmación', isCompleted: false, isActive: false }
      ],
      selectedServices: [],
      totalPrice: 0,
      totalDuration: 0
    };
    
    this.bookingProgressSubject.next(initialProgress);
  }

  updateBookingProgress(updates: Partial<BookingProgress>): void {
    const currentProgress = this.bookingProgressSubject.value;
    if (currentProgress) {
      const updatedProgress = { ...currentProgress, ...updates };
      this.bookingProgressSubject.next(updatedProgress);
    }
  }

  nextStep(): void {
    const currentProgress = this.bookingProgressSubject.value;
    if (currentProgress && currentProgress.currentStep < 5) {
      const updatedSteps = currentProgress.steps.map(step => ({
        ...step,
        isCompleted: step.stepNumber < currentProgress.currentStep + 1,
        isActive: step.stepNumber === currentProgress.currentStep + 1
      }));

      this.updateBookingProgress({
        currentStep: currentProgress.currentStep + 1,
        steps: updatedSteps
      });
    }
  }

  previousStep(): void {
    const currentProgress = this.bookingProgressSubject.value;
    if (currentProgress && currentProgress.currentStep > 1) {
      const updatedSteps = currentProgress.steps.map(step => ({
        ...step,
        isCompleted: step.stepNumber < currentProgress.currentStep - 1,
        isActive: step.stepNumber === currentProgress.currentStep - 1
      }));

      this.updateBookingProgress({
        currentStep: currentProgress.currentStep - 1,
        steps: updatedSteps
      });
    }
  }

  goToStep(stepNumber: number): void {
    const currentProgress = this.bookingProgressSubject.value;
    if (currentProgress && stepNumber >= 1 && stepNumber <= 5) {
      const updatedSteps = currentProgress.steps.map(step => ({
        ...step,
        isCompleted: step.stepNumber < stepNumber,
        isActive: step.stepNumber === stepNumber
      }));

      this.updateBookingProgress({
        currentStep: stepNumber,
        steps: updatedSteps
      });
    }
  }

  clearBookingProgress(): void {
    this.bookingProgressSubject.next(null);
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
