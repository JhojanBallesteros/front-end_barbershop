import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-content">
        <h1>Iniciar Sesión</h1>
        <p>Componente de Login en construcción...</p>
        <a routerLink="/" class="btn btn-primary">Volver al Inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .login-content {
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
export class LoginComponent {}
