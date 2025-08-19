import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-content">
        <h1>Registrarse</h1>
        <p>Componente de Registro en construcción...</p>
        <a routerLink="/" class="btn btn-primary">Volver al Inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .register-content {
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
export class RegisterComponent {}
