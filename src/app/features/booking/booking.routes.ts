import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'confirmation/:id',
    loadComponent: () => import('./confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  }
];
