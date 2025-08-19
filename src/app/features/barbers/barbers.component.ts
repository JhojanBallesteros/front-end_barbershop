import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Barber } from '../../core/models/barber.model';
import { BarberService } from '../../core/services/barber.service';

@Component({
  selector: 'app-barbers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="barbers-page">
      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <div class="header-content">
            <h1 class="page-title">Nuestro Equipo</h1>
            <p class="page-description">
              Conoce a nuestros barberos expertos, cada uno con años de experiencia 
              y especialización en diferentes técnicas y estilos.
            </p>
          </div>
        </div>
      </section>

      <!-- Barbers Grid -->
      <section class="barbers-content">
        <div class="container">
          <!-- Loading State -->
          <div class="loading-container" *ngIf="loading">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Cargando barberos...</p>
            </div>
          </div>

          <!-- Barbers Grid -->
          <div class="barbers-grid" *ngIf="barbers$ | async as barbers">
            <div class="barber-card" *ngFor="let barber of barbers; trackBy: trackByBarberId">
              <!-- Barber Image -->
              <div class="barber-image">
                <img 
                  [src]="barber.avatar || 'assets/images/default-barber.jpg'" 
                  [alt]="barber.firstName + ' ' + barber.lastName"
                  loading="lazy"
                >
                <div class="barber-status" [class.available]="barber.isActive">
                  <span class="status-indicator"></span>
                  <span class="status-text">{{ barber.isActive ? 'Disponible' : 'Ocupado' }}</span>
                </div>
                <div class="barber-rating">
                  <span class="rating-value">{{ barber.rating | number:'1.1-1' }}</span>
                  <svg class="rating-star" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>

              <!-- Barber Info -->
              <div class="barber-content">
                <div class="barber-header">
                  <h3 class="barber-name">{{ barber.firstName }} {{ barber.lastName }}</h3>
                  <span class="barber-experience">{{ barber.experience }} años de experiencia</span>
                </div>

                <p class="barber-bio" *ngIf="barber.bio">{{ barber.bio }}</p>

                <!-- Specializations -->
                <div class="barber-specializations">
                  <h4 class="specializations-title">Especialidades</h4>
                  <div class="specializations-grid">
                    <span 
                      class="specialization-tag" 
                      *ngFor="let specialization of barber.specializations"
                    >
                      {{ specialization }}
                    </span>
                  </div>
                </div>

                <!-- Stats -->
                <div class="barber-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ barber.rating | number:'1.1-1' }}</span>
                    <span class="stat-label">Calificación</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ barber.experience }}</span>
                    <span class="stat-label">Años</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ barber.specializations.length }}</span>
                    <span class="stat-label">Especialidades</span>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="barber-contact" *ngIf="barber.phone || barber.email">
                  <h4 class="contact-title">Contacto</h4>
                  <div class="contact-info">
                    <a 
                      *ngIf="barber.phone" 
                      [href]="'tel:' + barber.phone" 
                      class="contact-item"
                    >
                      <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      {{ barber.phone }}
                    </a>
                    <a 
                      *ngIf="barber.email" 
                      [href]="'mailto:' + barber.email" 
                      class="contact-item"
                    >
                      <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      {{ barber.email }}
                    </a>
                  </div>
                </div>

                <!-- Working Hours -->
                <div class="barber-schedule" *ngIf="barber.workingHours">
                  <h4 class="schedule-title">Horarios de Trabajo</h4>
                  <div class="schedule-info">
                    <div class="schedule-item" *ngFor="let schedule of getWorkingHours(barber.workingHours)">
                      <span class="schedule-day">{{ schedule.day }}</span>
                      <span class="schedule-time">{{ schedule.hours }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="barber-actions">
                  <a 
                    routerLink="/booking" 
                    [queryParams]="{barber: barber.id}" 
                    class="btn btn-primary"
                    [class.disabled]="!barber.isActive"
                  >
                    <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    {{ barber.isActive ? 'Reservar Cita' : 'No Disponible' }}
                  </a>
                  <button class="btn btn-outline" (click)="viewBarberProfile(barber.id)">
                    Ver Perfil Completo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Barbers State -->
          <div class="no-barbers" *ngIf="(barbers$ | async)?.length === 0 && !loading">
            <div class="no-barbers-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="no-barbers-title">No hay barberos disponibles</h3>
            <p class="no-barbers-message">
              Actualmente no tenemos barberos disponibles. Por favor, inténtalo más tarde.
            </p>
          </div>
        </div>
      </section>

      <!-- Team Stats Section -->
      <section class="team-stats-section">
        <div class="container">
          <h2 class="stats-title">Nuestro Equipo en Números</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <span class="stat-number">{{ getTotalBarbers() }}</span>
              <span class="stat-label">Barberos Expertos</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span class="stat-number">{{ getAverageRating() }}</span>
              <span class="stat-label">Calificación Promedio</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span class="stat-number">{{ getAverageExperience() }}</span>
              <span class="stat-label">Años de Experiencia</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="stat-number">{{ getAvailableBarbers() }}</span>
              <span class="stat-label">Disponibles Hoy</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">¿Tienes alguna preferencia especial?</h2>
            <p class="cta-description">
              Contáctanos y te ayudaremos a elegir el barbero perfecto para tu estilo
            </p>
            <div class="cta-actions">
              <a routerLink="/booking" class="btn btn-primary btn-lg">
                Reservar Cita
              </a>
              <a href="tel:+5712345678" class="btn btn-outline">
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .barbers-page {
      min-height: 100vh;
    }

    /* Page Header */
    .page-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 4rem 0 3rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .page-description {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    /* Barbers Content */
    .barbers-content {
      padding: 4rem 0;
      background: var(--background-gray);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .loading-spinner {
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Barbers Grid */
    .barbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .barber-card {
      background: white;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-light);
      transition: var(--transition);
    }

    .barber-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-medium);
    }

    /* Barber Image */
    .barber-image {
      position: relative;
      height: 300px;
      overflow: hidden;
    }

    .barber-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }

    .barber-card:hover .barber-image img {
      transform: scale(1.05);
    }

    .barber-status {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .barber-status.available {
      background: var(--success-color);
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }

    .barber-rating {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--secondary-color);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .rating-star {
      width: 12px;
      height: 12px;
    }

    /* Barber Content */
    .barber-content {
      padding: 2rem;
    }

    .barber-header {
      margin-bottom: 1rem;
    }

    .barber-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-dark);
      margin: 0 0 0.5rem 0;
    }

    .barber-experience {
      color: var(--text-medium);
      font-size: 0.9rem;
    }

    .barber-bio {
      color: var(--text-medium);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    /* Specializations */
    .barber-specializations {
      margin-bottom: 1.5rem;
    }

    .specializations-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.75rem;
    }

    .specializations-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .specialization-tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    /* Stats */
    .barber-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--background-gray);
      border-radius: var(--border-radius);
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--secondary-color);
    }

    .stat-label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-medium);
      margin-top: 0.25rem;
    }

    /* Contact */
    .barber-contact {
      margin-bottom: 1.5rem;
    }

    .contact-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.75rem;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-medium);
      text-decoration: none;
      font-size: 0.9rem;
      transition: var(--transition);
    }

    .contact-item:hover {
      color: var(--primary-color);
    }

    .contact-icon {
      width: 16px;
      height: 16px;
    }

    /* Schedule */
    .barber-schedule {
      margin-bottom: 1.5rem;
    }

    .schedule-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.75rem;
    }

    .schedule-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .schedule-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .schedule-day {
      font-weight: 500;
      color: var(--text-dark);
    }

    .schedule-time {
      color: var(--text-medium);
    }

    /* Actions */
    .barber-actions {
      display: flex;
      gap: 1rem;
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
      flex: 1;
      min-width: 140px;
    }

    .btn-primary {
      background: var(--secondary-color);
      color: white;
      border-color: var(--secondary-color);
    }

    .btn-primary:hover:not(.disabled) {
      background: var(--secondary-dark);
      border-color: var(--secondary-dark);
    }

    .btn-primary.disabled {
      background: var(--text-light);
      border-color: var(--text-light);
      cursor: not-allowed;
    }

    .btn-outline {
      background: transparent;
      color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .btn-outline:hover {
      background: var(--primary-color);
      color: white;
    }

    .btn-icon {
      width: 16px;
      height: 16px;
    }

    /* No Barbers */
    .no-barbers {
      text-align: center;
      padding: 4rem 2rem;
    }

    .no-barbers-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      color: var(--text-light);
    }

    .no-barbers-icon svg {
      width: 100%;
      height: 100%;
    }

    .no-barbers-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .no-barbers-message {
      color: var(--text-medium);
      max-width: 400px;
      margin: 0 auto;
    }

    /* Team Stats Section */
    .team-stats-section {
      background: white;
      padding: 4rem 0;
    }

    .stats-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      text-align: center;
      padding: 2rem 1rem;
      background: var(--background-gray);
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-medium);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 1rem;
      color: var(--primary-color);
    }

    .stat-icon svg {
      width: 100%;
      height: 100%;
    }

    .stat-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--secondary-color);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-medium);
      font-weight: 500;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-description {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    .cta-section .btn-outline {
      border-color: white;
      color: white;
    }

    .cta-section .btn-outline:hover {
      background: white;
      color: var(--primary-color);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .barbers-grid {
        grid-template-columns: 1fr;
      }

      .barber-stats {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .barber-actions {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .barber-content {
        padding: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .contact-info {
        align-items: flex-start;
      }
    }
  `]
})
export class BarbersComponent implements OnInit {
  barbers$!: Observable<Barber[]>;
  loading = false;
  private allBarbers: Barber[] = [];

  constructor(private barberService: BarberService) {}

  ngOnInit() {
    this.loadBarbers();
  }

  private loadBarbers() {
    this.loading = true;
    this.barbers$ = this.barberService.getBarbers().pipe(
      map(response => response.barbers)
    );
    this.barbers$.subscribe(barbers => {
      this.allBarbers = barbers;
      this.loading = false;
    });
  }

  viewBarberProfile(barberId: string) {
    // TODO: Implement barber profile navigation
    console.log('View barber profile:', barberId);
  }

  getWorkingHours(workingHours: any): { day: string; hours: string }[] {
    // Transform working hours object to array for display
    if (!workingHours) return [];
    
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return dayKeys.map((key, index) => {
      const daySchedule = workingHours[key];
      let hours = 'Cerrado';
      
      if (daySchedule && daySchedule.isWorking) {
        hours = `${daySchedule.startTime} - ${daySchedule.endTime}`;
      }
      
      return {
        day: days[index],
        hours
      };
    });
  }

  getTotalBarbers(): number {
    return this.allBarbers.length;
  }

  getAverageRating(): string {
    if (this.allBarbers.length === 0) return '0.0';
    const totalRating = this.allBarbers.reduce((sum, barber) => sum + barber.rating, 0);
    return (totalRating / this.allBarbers.length).toFixed(1);
  }

  getAverageExperience(): number {
    if (this.allBarbers.length === 0) return 0;
    const totalExperience = this.allBarbers.reduce((sum, barber) => sum + barber.experience, 0);
    return Math.round(totalExperience / this.allBarbers.length);
  }

  getAvailableBarbers(): number {
    return this.allBarbers.filter(barber => barber.isActive).length;
  }

  trackByBarberId(index: number, barber: Barber): string {
    return barber.id;
  }
}
