import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Página no encontrada</h1>
        <p class="error-description">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div class="error-actions">
          <a routerLink="/" class="btn btn-primary">
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V17a1 1 0 102 0V5.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Volver al Inicio
          </a>
          <button class="btn btn-outline" (click)="goBack()">
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
            </svg>
            Regresar
          </button>
        </div>
      </div>
      <div class="error-illustration">
        <svg viewBox="0 0 404 404" fill="none">
          <defs>
            <filter id="filter0_f" x="-4" y="-4" width="412" height="412" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur"/>
            </filter>
          </defs>
          <g filter="url(#filter0_f)">
            <circle cx="202" cy="202" r="200" fill="url(#paint0_linear)"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear" x1="202" y1="2" x2="202" y2="402" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8B5CF6" stop-opacity="0.3"/>
              <stop offset="1" stop-color="#3B82F6" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, var(--background-gray) 0%, #f8fafc 100%);
      position: relative;
      overflow: hidden;
    }

    .not-found-content {
      text-align: center;
      max-width: 500px;
      z-index: 10;
      position: relative;
    }

    .error-code {
      font-size: 8rem;
      font-weight: 900;
      color: var(--primary-color);
      line-height: 1;
      margin-bottom: 1rem;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .error-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .error-description {
      font-size: 1.1rem;
      color: var(--text-medium);
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: var(--border-radius);
      text-decoration: none;
      font-weight: 600;
      border: 2px solid transparent;
      transition: var(--transition);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      border-color: var(--primary-dark);
    }

    .btn-outline {
      background: transparent;
      color: var(--text-dark);
      border-color: var(--border-color);
    }

    .btn-outline:hover {
      background: var(--text-dark);
      color: white;
      border-color: var(--text-dark);
    }

    .btn-icon {
      width: 16px;
      height: 16px;
    }

    .error-illustration {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 404px;
      height: 404px;
      opacity: 0.5;
      z-index: 1;
    }

    .error-illustration svg {
      width: 100%;
      height: 100%;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .error-code {
        font-size: 6rem;
      }

      .error-title {
        font-size: 2rem;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }

      .error-illustration {
        width: 300px;
        height: 300px;
        opacity: 0.3;
      }
    }

    @media (max-width: 480px) {
      .not-found-container {
        padding: 1rem;
      }

      .error-code {
        font-size: 4rem;
      }

      .error-title {
        font-size: 1.5rem;
      }

      .error-description {
        font-size: 1rem;
      }
    }
  `]
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}
