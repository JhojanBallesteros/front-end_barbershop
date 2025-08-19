import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-bookings-container">
      <div class="my-bookings-content">
        <h1>Mis Reservas</h1>
        <p>Componente de Mis Reservas en construcción...</p>
        <a routerLink="/" class="btn btn-primary">Volver al Inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .my-bookings-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .my-bookings-content {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: var(--border-radius);
      font-weight: 600;
    }
  `]
})
export class MyBookingsComponent {}
