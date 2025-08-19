import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';

// Este es un servicio simple para manejar el estado de carga
export class LoadingService {
  private loadingCount = 0;
  public isLoading = false;

  startLoading() {
    this.loadingCount++;
    this.isLoading = true;
  }

  stopLoading() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.isLoading = false;
    }
  }
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // En una implementación real, inyectarías un servicio de loading
  // const loadingService = inject(LoadingService);
  
  // loadingService.startLoading();
  
  return next(req).pipe(
    finalize(() => {
      // loadingService.stopLoading();
    })
  );
};
