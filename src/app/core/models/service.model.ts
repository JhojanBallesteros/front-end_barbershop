export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: ServiceCategory;
  imageUrl?: string;
  isActive: boolean;
  requirements?: string[];
  features?: string[]; // List of features included
  isPopular?: boolean; // Popular service flag
  createdAt: Date;
  updatedAt: Date;
}

export enum ServiceCategory {
  HAIRCUT = 'haircut',
  BEARD = 'beard',
  STYLING = 'styling',
  TREATMENT = 'treatment',
  PACKAGE = 'package'
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: Service[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  duration: number; // total duration in minutes
  imageUrl?: string;
  isActive: boolean;
  validUntil?: Date;
}
