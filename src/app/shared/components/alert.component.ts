import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertData {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: boolean;
  duration?: number;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert" [ngClass]="getAlertClasses()" [class.show]="isVisible" *ngIf="alert">
      <div class="alert-content">
        <div class="alert-icon">
          <ng-container [ngSwitch]="alert.type">
            <svg *ngSwitchCase="'success'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <svg *ngSwitchCase="'error'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
            <svg *ngSwitchCase="'warning'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg *ngSwitchCase="'info'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </ng-container>
        </div>
        <div class="alert-text">
          <h5 *ngIf="alert.title" class="alert-title">{{ alert.title }}</h5>
          <p class="alert-message">{{ alert.message }}</p>
        </div>
        <button 
          *ngIf="alert.dismissible" 
          class="alert-close" 
          (click)="close()"
          aria-label="Close alert">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .alert {
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .alert.show {
      opacity: 1;
      transform: translateY(0);
    }

    .alert-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .alert-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    .alert-icon svg {
      width: 100%;
      height: 100%;
    }

    .alert-text {
      flex: 1;
    }

    .alert-title {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .alert-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.4;
    }

    .alert-close {
      background: none;
      border: none;
      padding: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }

    .alert-close:hover {
      opacity: 1;
    }

    .alert-close svg {
      width: 100%;
      height: 100%;
    }

    /* Alert type styles */
    .alert.success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }

    .alert.error {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .alert.warning {
      background-color: #fff3cd;
      border-color: #ffeaa7;
      color: #856404;
    }

    .alert.info {
      background-color: #d1ecf1;
      border-color: #bee5eb;
      color: #0c5460;
    }
  `]
})
export class AlertComponent {
  @Input() alert: AlertData | null = null;
  @Input() isVisible = true;

  ngOnInit() {
    if (this.alert?.autoClose) {
      const duration = this.alert.duration || 5000;
      setTimeout(() => {
        this.close();
      }, duration);
    }
  }

  getAlertClasses(): string {
    if (!this.alert) return '';
    return `alert-${this.alert.type}`;
  }

  close() {
    this.isVisible = false;
    setTimeout(() => {
      this.alert = null;
    }, 300);
  }
}
