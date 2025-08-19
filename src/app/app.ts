import { Component, signal, OnInit, HostListener, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './core/models/user.model';
import { AuthService } from './core/services/auth.service';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner.component';
import { AlertComponent, AlertData } from './shared/components/alert.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LoadingSpinnerComponent,
    AlertComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Barber Shop');
  
  currentUser$: Observable<User | null>;
  currentYear = new Date().getFullYear();
  isLoading = false;
  loadingMessage = '';
  currentAlert: AlertData | null = null;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.setupLoadingListener();
  }

  ngOnInit() {
    // Handle mobile menu close on route change
    this.router.events.subscribe(() => {
      this.isMobileMenuOpen = false;
      this.isUserMenuOpen = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userDropdown = this.document.querySelector('.user-dropdown');
    
    if (userDropdown && !userDropdown.contains(target)) {
      this.isUserMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scroll when mobile menu is open
    if (this.isMobileMenuOpen) {
      this.document.body.style.overflow = 'hidden';
    } else {
      this.document.body.style.overflow = '';
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.isLoading = true;
    this.loadingMessage = 'Cerrando sesión...';
    
    this.authService.logout().subscribe({
      next: () => {
        this.isLoading = false;
        this.showAlert({
          type: 'success',
          title: 'Sesión cerrada',
          message: 'Has cerrado sesión exitosamente.',
          autoClose: true,
          duration: 3000
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({
          type: 'error',
          title: 'Error',
          message: 'Error al cerrar sesión. Inténtalo de nuevo.',
          dismissible: true
        });
      }
    });
  }

  private setupLoadingListener() {
    this.document.addEventListener('loading-status', (event: any) => {
      this.isLoading = event.detail.loading;
      if (!this.isLoading) {
        this.loadingMessage = '';
      }
    });
  }

  private showAlert(alert: AlertData) {
    this.currentAlert = alert;
    
    // Auto-remove alert after duration if not dismissible
    if (alert.autoClose && !alert.dismissible) {
      setTimeout(() => {
        this.currentAlert = null;
      }, alert.duration || 5000);
    }
  }
}
