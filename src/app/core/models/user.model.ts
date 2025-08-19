export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: Date;
  avatar?: string;
  role: UserRole;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  preferredBarber?: string;
  favoriteServices: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export enum UserRole {
  CLIENT = 'client',
  BARBER = 'barber',
  ADMIN = 'admin'
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
