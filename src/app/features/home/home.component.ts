import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Service } from '../../core/models/service.model';
import { Barber } from '../../core/models/barber.model';
import { ServiceService } from '../../core/services/service.service';
import { BarberService } from '../../core/services/barber.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Tu Mejor Estilo 
              <span class="text-accent">Te Espera</span>
            </h1>
            <p class="hero-description">
              Descubre la experiencia de un corte profesional en nuestra barbería. 
              Profesionales expertos, ambiente acogedor y los mejores servicios para tu estilo personal.
            </p>
            <div class="hero-actions">
              <a routerLink="/booking" class="btn btn-primary btn-lg">
                Reservar Cita
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </a>
              <a routerLink="/services" class="btn btn-outline">Ver Servicios</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="assets/images/hero-barber.jpg" alt="Barbero profesional" class="hero-img">
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">1000+</span>
                <span class="stat-label">Clientes Satisfechos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">5+</span>
                <span class="stat-label">Años de Experiencia</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">10+</span>
                <span class="stat-label">Servicios Especializados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">¿Por Qué Elegirnos?</h2>
          <p class="section-description">
            Ofrecemos una experiencia única con profesionales especializados y tecnología moderna
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="feature-title">Profesionales Certificados</h3>
            <p class="feature-description">
              Nuestros barberos cuentan con certificaciones internacionales y años de experiencia
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <h3 class="feature-title">Reservas Online</h3>
            <p class="feature-description">
              Sistema de reservas 24/7 para tu comodidad. Elige fecha, hora y barbero preferido
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="feature-title">Productos Premium</h3>
            <p class="feature-description">
              Utilizamos únicamente productos de marcas reconocidas para garantizar los mejores resultados
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3 class="feature-title">Atención Personalizada</h3>
            <p class="feature-description">
              Cada cliente recibe un servicio único adaptado a sus necesidades y preferencias
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="section-description">
            Descubre nuestra amplia gama de servicios profesionales
          </p>
        </div>
        <div class="services-grid" *ngIf="popularServices$ | async as services">
          <div class="service-card" *ngFor="let service of services; trackBy: trackByServiceId">
            <div class="service-image">
              <img [src]="service.imageUrl || 'assets/images/default-service.jpg'" [alt]="service.name">
              <div class="service-overlay">
                <span class="service-duration">{{ service.duration }} min</span>
              </div>
            </div>
            <div class="service-content">
              <h3 class="service-name">{{ service.name }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-footer">
                <span class="service-price">&#36;{{ service.price | number:'1.0-0' }}</span>
                <a routerLink="/booking" [queryParams]="{service: service.id}" class="btn btn-sm btn-primary">
                  Reservar
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="services-actions">
          <a routerLink="/services" class="btn btn-outline">Ver Todos los Servicios</a>
        </div>
      </div>
    </section>

    <!-- Barbers Section -->
    <section class="barbers-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Nuestro Equipo</h2>
          <p class="section-description">
            Conoce a nuestros expertos barberos profesionales
          </p>
        </div>
        <div class="barbers-grid" *ngIf="topBarbers$ | async as barbers">
          <div class="barber-card" *ngFor="let barber of barbers; trackBy: trackByBarberId">
            <div class="barber-image">
              <img [src]="barber.avatar || 'assets/images/default-barber.jpg'" [alt]="barber.firstName + ' ' + barber.lastName">
              <div class="barber-rating">
                <span class="rating-value">{{ barber.rating | number:'1.1-1' }}</span>
                <svg class="rating-star" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
            <div class="barber-content">
              <h3 class="barber-name">{{ barber.firstName }} {{ barber.lastName }}</h3>
              <p class="barber-experience">{{ barber.experience }} años de experiencia</p>
              <div class="barber-specializations">
                <span class="specialization-tag" *ngFor="let spec of barber.specializations.slice(0, 2)">
                  {{ spec }}
                </span>
              </div>
              <a routerLink="/booking" [queryParams]="{barber: barber.id}" class="btn btn-sm btn-outline">
                Reservar con {{ barber.firstName }}
              </a>
            </div>
          </div>
        </div>
        <div class="barbers-actions">
          <a routerLink="/barbers" class="btn btn-outline">Ver Todo el Equipo</a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para tu nuevo estilo?</h2>
          <p class="cta-description">
            Reserva tu cita ahora y experimenta el mejor servicio de barbería en la ciudad
          </p>
          <div class="cta-actions">
            <a routerLink="/booking" class="btn btn-primary btn-lg">
              Reservar Ahora
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </a>
            <div class="cta-contact">
              <p class="contact-text">O llama directamente</p>
              <a href="tel:+5712345678" class="contact-phone">+57 (1) 234-5678</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 4rem 0;
      overflow: hidden;
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 1.5rem;
      line-height: 1.1;
    }

    .text-accent {
      color: var(--secondary-color);
    }

    .hero-description {
      font-size: 1.2rem;
      color: var(--text-medium);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
      margin-left: 0.5rem;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--secondary-color);
      color: var(--secondary-color);
    }

    .btn-outline:hover {
      background: var(--secondary-color);
      color: white;
    }

    .hero-image {
      position: relative;
    }

    .hero-img {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-heavy);
    }

    .hero-stats {
      position: absolute;
      bottom: -2rem;
      left: 2rem;
      right: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--secondary-color);
    }

    .stat-label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-medium);
      margin-top: 0.25rem;
    }

    /* Common Section Styles */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .section-description {
      font-size: 1.1rem;
      color: var(--text-medium);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Features Section */
    .features-section {
      padding: 5rem 0;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem 1rem;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-medium);
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--secondary-color), #2980b9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: white;
    }

    .feature-icon svg {
      width: 30px;
      height: 30px;
    }

    .feature-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .feature-description {
      color: var(--text-medium);
      line-height: 1.6;
    }

    /* Services Section */
    .services-section {
      padding: 5rem 0;
      background: var(--background-gray);
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .service-card {
      background: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-light);
      transition: var(--transition);
    }

    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-medium);
    }

    .service-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .service-overlay {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .service-duration {
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .service-content {
      padding: 1.5rem;
    }

    .service-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .service-description {
      color: var(--text-medium);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .service-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .service-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--secondary-color);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .services-actions {
      text-align: center;
    }

    /* Barbers Section */
    .barbers-section {
      padding: 5rem 0;
      background: white;
    }

    .barbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .barber-card {
      text-align: center;
      padding: 1.5rem;
      background: var(--background-gray);
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    .barber-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-medium);
    }

    .barber-image {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 1rem;
    }

    .barber-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .barber-rating {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--success-color);
      color: white;
      padding: 0.25rem 0.5rem;
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

    .barber-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .barber-experience {
      color: var(--text-medium);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .barber-specializations {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .specialization-tag {
      background: var(--secondary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .barbers-actions {
      text-align: center;
    }

    /* CTA Section */
    .cta-section {
      padding: 5rem 0;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
    }

    .cta-content {
      text-align: center;
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
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .cta-contact {
      text-align: center;
    }

    .contact-text {
      margin: 0 0 0.5rem 0;
      opacity: 0.8;
    }

    .contact-phone {
      color: white;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .contact-phone:hover {
      text-decoration: underline;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-stats {
        position: static;
        margin-top: 2rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid,
      .services-grid,
      .barbers-grid {
        grid-template-columns: 1fr;
      }

      .cta-title {
        font-size: 2rem;
      }

      .hero-actions {
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  popularServices$!: Observable<Service[]>;
  topBarbers$!: Observable<Barber[]>;

  constructor(
    private serviceService: ServiceService,
    private barberService: BarberService
  ) {}

  ngOnInit() {
    this.loadPopularServices();
    this.loadTopBarbers();
  }

  private loadPopularServices() {
    this.popularServices$ = this.serviceService.getPopularServices(6);
  }

  private loadTopBarbers() {
    this.topBarbers$ = this.barberService.getTopRatedBarbers(4);
  }

  trackByServiceId(index: number, service: Service): string {
    return service.id;
  }

  trackByBarberId(index: number, barber: Barber): string {
    return barber.id;
  }
}
