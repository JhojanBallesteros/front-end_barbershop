import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Service } from '../../core/models/service.model';
import { ServiceService } from '../../core/services/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="services-page">
      <!-- Header Section -->
      <section class="page-header">
        <div class="container">
          <div class="header-content">
            <h1 class="page-title">Nuestros Servicios</h1>
            <p class="page-description">
              Descubre nuestra completa gama de servicios profesionales de barbería, 
              diseñados para realzar tu estilo personal con la máxima calidad.
            </p>
          </div>
        </div>
      </section>

      <!-- Filters Section -->
      <section class="filters-section">
        <div class="container">
          <div class="filters-container">
            <div class="filter-group">
              <label for="search" class="filter-label">Buscar Servicio</label>
              <div class="search-input-group">
                <input
                  id="search"
                  type="text"
                  class="search-input"
                  placeholder="Buscar por nombre o descripción..."
                  [(ngModel)]="searchTerm"
                  (input)="onSearchChange($event)"
                >
                <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>

            <div class="filter-group">
              <label for="category" class="filter-label">Categoría</label>
              <select 
                id="category" 
                class="filter-select"
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
              >
                <option value="">Todas las categorías</option>
                <option value="haircut">Cortes de Cabello</option>
                <option value="shave">Afeitado</option>
                <option value="beard">Cuidado de Barba</option>
                <option value="styling">Peinado</option>
                <option value="treatment">Tratamientos</option>
                <option value="package">Paquetes</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="priceRange" class="filter-label">Rango de Precio</label>
              <select 
                id="priceRange" 
                class="filter-select"
                [(ngModel)]="selectedPriceRange"
                (change)="onPriceRangeChange()"
              >
                <option value="">Todos los precios</option>
                <option value="0-25">&#36;0 - &#36;25</option>
                <option value="26-50">&#36;26 - &#36;50</option>
                <option value="51-75">&#36;51 - &#36;75</option>
                <option value="76-100">&#36;76 - &#36;100</option>
                <option value="100+">&#36;100+</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="duration" class="filter-label">Duración</label>
              <select 
                id="duration" 
                class="filter-select"
                [(ngModel)]="selectedDuration"
                (change)="onDurationChange()"
              >
                <option value="">Cualquier duración</option>
                <option value="0-30">Hasta 30 min</option>
                <option value="31-60">31 - 60 min</option>
                <option value="61-90">61 - 90 min</option>
                <option value="90+">Más de 90 min</option>
              </select>
            </div>
          </div>

          <!-- Active Filters -->
          <div class="active-filters" *ngIf="hasActiveFilters()">
            <span class="active-filters-label">Filtros activos:</span>
            <div class="filter-tags">
              <span class="filter-tag" *ngIf="searchTerm">
                Búsqueda: "{{ searchTerm }}"
                <button class="remove-filter" (click)="clearSearch()">×</button>
              </span>
              <span class="filter-tag" *ngIf="selectedCategory">
                {{ getCategoryLabel(selectedCategory) }}
                <button class="remove-filter" (click)="clearCategory()">×</button>
              </span>
              <span class="filter-tag" *ngIf="selectedPriceRange">
                Precio: {{ getPriceRangeLabel(selectedPriceRange) }}
                <button class="remove-filter" (click)="clearPriceRange()">×</button>
              </span>
              <span class="filter-tag" *ngIf="selectedDuration">
                Duración: {{ getDurationLabel(selectedDuration) }}
                <button class="remove-filter" (click)="clearDuration()">×</button>
              </span>
              <button class="clear-all-filters" (click)="clearAllFilters()">
                Limpiar todos los filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="services-content">
        <div class="container">
          <div class="services-header">
            <h2 class="services-count" *ngIf="filteredServices$ | async as services">
              {{ services.length }} servicio{{ services.length !== 1 ? 's' : '' }} encontrado{{ services.length !== 1 ? 's' : '' }}
            </h2>
          </div>

          <!-- Loading State -->
          <div class="loading-container" *ngIf="loading">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Cargando servicios...</p>
            </div>
          </div>

          <!-- Services Grid -->
          <div class="services-grid" *ngIf="filteredServices$ | async as services; else noServices">
            <div class="service-card" *ngFor="let service of services; trackBy: trackByServiceId">
              <div class="service-image">
                <img 
                  [src]="service.imageUrl || 'assets/images/default-service.jpg'" 
                  [alt]="service.name"
                  loading="lazy"
                >
                <div class="service-overlay">
                  <span class="service-duration">{{ service.duration }} min</span>
                  <span class="service-category">{{ getCategoryLabel(service.category) }}</span>
                </div>
              </div>
              
              <div class="service-content">
                <div class="service-header">
                  <h3 class="service-name">{{ service.name }}</h3>
                  <span class="service-price">&#36;{{ service.price | number:'1.0-0' }}</span>
                </div>
                
                <p class="service-description">{{ service.description }}</p>
                
                <div class="service-features" *ngIf="service.features && service.features.length > 0">
                  <h4 class="features-title">Incluye:</h4>
                  <ul class="features-list">
                    <li *ngFor="let feature of service.features.slice(0, 3)">{{ feature }}</li>
                    <li *ngIf="service.features.length > 3" class="more-features">
                      +{{ service.features.length - 3 }} más
                    </li>
                  </ul>
                </div>
                
                <div class="service-footer">
                  <div class="service-info">
                    <span class="info-item">
                      <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      {{ service.duration }} min
                    </span>
                    <span class="info-item" *ngIf="service.isPopular">
                      <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Popular
                    </span>
                  </div>
                  
                  <a 
                    routerLink="/booking" 
                    [queryParams]="{service: service.id}" 
                    class="btn btn-primary"
                  >
                    Reservar Cita
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- No Services Found -->
          <ng-template #noServices>
            <div class="no-services" *ngIf="!loading">
              <div class="no-services-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 class="no-services-title">No se encontraron servicios</h3>
              <p class="no-services-message">
                No hay servicios que coincidan con los filtros seleccionados. 
                Intenta ajustar los criterios de búsqueda.
              </p>
              <button class="btn btn-primary" (click)="clearAllFilters()">
                Limpiar Filtros
              </button>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">¿No encuentras lo que buscas?</h2>
            <p class="cta-description">
              Contáctanos y encontraremos el servicio perfecto para ti
            </p>
            <div class="cta-actions">
              <a href="tel:+5712345678" class="btn btn-outline">
                Llamar Ahora
              </a>
              <a routerLink="/contact" class="btn btn-primary">
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .services-page {
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

    /* Filters Section */
    .filters-section {
      background: white;
      padding: 2rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .filters-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .search-input-group {
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: var(--transition);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }

    .search-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: var(--text-medium);
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius);
      font-size: 1rem;
      background: white;
      transition: var(--transition);
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }

    /* Active Filters */
    .active-filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }

    .active-filters-label {
      font-weight: 600;
      color: var(--text-dark);
    }

    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .remove-filter {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-all-filters {
      background: var(--error-color);
      color: white;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .clear-all-filters:hover {
      background: var(--error-dark);
    }

    /* Services Content */
    .services-content {
      padding: 3rem 0;
      background: var(--background-gray);
    }

    .services-header {
      margin-bottom: 2rem;
    }

    .services-count {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-dark);
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

    /* Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .service-card {
      background: white;
      border-radius: var(--border-radius-lg);
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
      transition: var(--transition);
    }

    .service-card:hover .service-image img {
      transform: scale(1.05);
    }

    .service-overlay {
      position: absolute;
      top: 1rem;
      left: 1rem;
      right: 1rem;
      display: flex;
      justify-content: space-between;
    }

    .service-duration,
    .service-category {
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .service-category {
      background: var(--secondary-color);
    }

    .service-content {
      padding: 1.5rem;
    }

    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .service-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
      flex: 1;
    }

    .service-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--secondary-color);
      margin-left: 1rem;
    }

    .service-description {
      color: var(--text-medium);
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .service-features {
      margin-bottom: 1.5rem;
    }

    .features-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .features-list li {
      font-size: 0.9rem;
      color: var(--text-medium);
      padding: 0.25rem 0;
      position: relative;
      padding-left: 1.5rem;
    }

    .features-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--success-color);
      font-weight: bold;
    }

    .more-features {
      font-style: italic;
      color: var(--text-light) !important;
    }

    .more-features:before {
      content: "⋯";
      color: var(--text-light) !important;
    }

    .service-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .service-info {
      display: flex;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: var(--text-medium);
    }

    .info-icon {
      width: 14px;
      height: 14px;
    }

    /* No Services */
    .no-services {
      text-align: center;
      padding: 4rem 2rem;
    }

    .no-services-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      color: var(--text-light);
    }

    .no-services-icon svg {
      width: 100%;
      height: 100%;
    }

    .no-services-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .no-services-message {
      color: var(--text-medium);
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    /* CTA Section */
    .cta-section {
      background: var(--primary-color);
      color: white;
      padding: 3rem 0;
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 2rem;
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
    }

    .btn-primary {
      background: var(--secondary-color);
      color: white;
      border-color: var(--secondary-color);
    }

    .btn-primary:hover {
      background: var(--secondary-dark);
      border-color: var(--secondary-dark);
    }

    .btn-outline {
      background: transparent;
      color: white;
      border-color: white;
    }

    .btn-outline:hover {
      background: white;
      color: var(--primary-color);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .filters-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .service-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .service-price {
        margin-left: 0;
      }

      .service-footer {
        flex-direction: column;
        align-items: stretch;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .cta-title {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .service-info {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  // Filter properties
  searchTerm = '';
  selectedCategory = '';
  selectedPriceRange = '';
  selectedDuration = '';
  loading = false;

  // Observables
  services$!: Observable<Service[]>;
  filteredServices$!: Observable<Service[]>;

  // Subjects for filtering
  private searchSubject = new BehaviorSubject<string>('');
  private categorySubject = new BehaviorSubject<string>('');
  private priceRangeSubject = new BehaviorSubject<string>('');
  private durationSubject = new BehaviorSubject<string>('');

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loadServices();
    this.setupFiltering();
  }

  private loadServices() {
    this.loading = true;
    this.services$ = this.serviceService.getServices().pipe(
      map(response => response.services)
    );
    this.services$.subscribe(() => {
      this.loading = false;
    });
  }

  private setupFiltering() {
    this.filteredServices$ = combineLatest([
      this.services$,
      this.searchSubject.asObservable(),
      this.categorySubject.asObservable(),
      this.priceRangeSubject.asObservable(),
      this.durationSubject.asObservable()
    ]).pipe(
      map(([services, search, category, priceRange, duration]) => {
        return services.filter(service => {
          // Search filter
          if (search) {
            const searchLower = search.toLowerCase();
            const matchesSearch = 
              service.name.toLowerCase().includes(searchLower) ||
              service.description.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }

          // Category filter
          if (category && service.category !== category) {
            return false;
          }

          // Price range filter
          if (priceRange) {
            const [min, max] = this.parsePriceRange(priceRange);
            if (service.price < min || (max && service.price > max)) {
              return false;
            }
          }

          // Duration filter
          if (duration) {
            const [minDuration, maxDuration] = this.parseDurationRange(duration);
            if (service.duration < minDuration || (maxDuration && service.duration > maxDuration)) {
              return false;
            }
          }

          return true;
        });
      })
    );
  }

  // Filter change handlers
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }

  onCategoryChange() {
    this.categorySubject.next(this.selectedCategory);
  }

  onPriceRangeChange() {
    this.priceRangeSubject.next(this.selectedPriceRange);
  }

  onDurationChange() {
    this.durationSubject.next(this.selectedDuration);
  }

  // Clear filter methods
  clearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  clearCategory() {
    this.selectedCategory = '';
    this.categorySubject.next('');
  }

  clearPriceRange() {
    this.selectedPriceRange = '';
    this.priceRangeSubject.next('');
  }

  clearDuration() {
    this.selectedDuration = '';
    this.durationSubject.next('');
  }

  clearAllFilters() {
    this.clearSearch();
    this.clearCategory();
    this.clearPriceRange();
    this.clearDuration();
  }

  // Helper methods
  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedCategory || this.selectedPriceRange || this.selectedDuration);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'haircut': 'Cortes de Cabello',
      'shave': 'Afeitado',
      'beard': 'Cuidado de Barba',
      'styling': 'Peinado',
      'treatment': 'Tratamientos',
      'package': 'Paquetes'
    };
    return labels[category] || category;
  }

  getPriceRangeLabel(range: string): string {
    const labels: Record<string, string> = {
      '0-25': '$0 - $25',
      '26-50': '$26 - $50',
      '51-75': '$51 - $75',
      '76-100': '$76 - $100',
      '100+': '$100+'
    };
    return labels[range] || range;
  }

  getDurationLabel(range: string): string {
    const labels: Record<string, string> = {
      '0-30': 'Hasta 30 min',
      '31-60': '31 - 60 min',
      '61-90': '61 - 90 min',
      '90+': 'Más de 90 min'
    };
    return labels[range] || range;
  }

  private parsePriceRange(range: string): [number, number | null] {
    switch (range) {
      case '0-25': return [0, 25];
      case '26-50': return [26, 50];
      case '51-75': return [51, 75];
      case '76-100': return [76, 100];
      case '100+': return [100, null];
      default: return [0, null];
    }
  }

  private parseDurationRange(range: string): [number, number | null] {
    switch (range) {
      case '0-30': return [0, 30];
      case '31-60': return [31, 60];
      case '61-90': return [61, 90];
      case '90+': return [90, null];
      default: return [0, null];
    }
  }

  trackByServiceId(index: number, service: Service): string {
    return service.id;
  }
}
