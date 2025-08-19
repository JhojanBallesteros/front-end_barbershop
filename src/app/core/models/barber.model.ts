export interface Barber {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  specializations: string[];
  experience: number; // years of experience
  rating: number;
  totalReviews: number;
  workingHours: WorkingHours;
  unavailableDates: Date[];
  services: string[]; // service IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isWorking: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakStart?: string;
  breakEnd?: string;
}

export interface BarberAvailability {
  barberId: string;
  date: Date;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string; // HH:mm format
  isAvailable: boolean;
  duration: number; // in minutes
}
