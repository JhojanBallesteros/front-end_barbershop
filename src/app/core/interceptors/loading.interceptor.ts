import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingRequests++;
    this.setLoadingStatus(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.loadingRequests--;
        if (this.loadingRequests === 0) {
          this.setLoadingStatus(false);
        }
      })
    );
  }

  private setLoadingStatus(loading: boolean): void {
    // Emit loading status to a service or global state
    // This can be connected to a loading service or NgRx store
    document.dispatchEvent(new CustomEvent('loading-status', { 
      detail: { loading } 
    }));
  }
}
