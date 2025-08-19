import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="reset-password-container">
      <div class="reset-password-content">
        <h1>Restablecer Contraseña</h1>
        <p>Componente de Restablecimiento de Contraseña en construcción...</p>
        <a routerLink="/auth/login" class="btn btn-primary">Volver al Login</a>
      </div>
    </div>
  `,
  styles: [`
    .reset-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .reset-password-content {
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
export class ResetPasswordComponent {}
