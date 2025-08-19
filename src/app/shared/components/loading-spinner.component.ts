import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.visible]="isLoading">
      <div class="spinner-container">
        <div class="spinner" [style.--size]="size + 'px'">
          <div class="spinner-circle"></div>
        </div>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .loading-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .spinner-container {
      text-align: center;
    }

    .spinner {
      width: var(--size);
      height: var(--size);
      margin: 0 auto 1rem;
      position: relative;
    }

    .spinner-circle {
      width: 100%;
      height: 100%;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-message {
      color: white;
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    /* Local spinner styles */
    .local-spinner {
      display: inline-block;
      vertical-align: middle;
    }

    .local-spinner .spinner-circle {
      border-color: #e3e3e3;
      border-top-color: currentColor;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
  @Input() message = '';
  @Input() size = 50;
  @Input() local = false;
}
