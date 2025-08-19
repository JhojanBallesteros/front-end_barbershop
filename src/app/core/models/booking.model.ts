export interface Booking {
  id: string;
  userId: string;
  barberId: string;
  serviceIds: string[];
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  totalDuration: number; // in minutes
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  cancelationReason?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export interface CreateBookingRequest {
  barberId: string;
  serviceIds: string[];
  date: Date;
  startTime: string;
  notes?: string;
}

export interface BookingStep {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  data?: any;
}

export interface BookingProgress {
  currentStep: number;
  steps: BookingStep[];
  selectedServices: string[];
  selectedBarber?: string;
  selectedDate?: Date;
  selectedTime?: string;
  customerInfo?: CustomerInfo;
  totalPrice: number;
  totalDuration: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  isNewCustomer: boolean;
}
