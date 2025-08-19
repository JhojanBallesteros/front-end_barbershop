export const environment = {
  production: true,
  apiUrl: 'https://api.barbershop.com/api',
  appName: 'Barber Shop',
  appVersion: '1.0.0',
  enableAnalytics: true,
  maxFileSize: 5242880, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  bookingConfig: {
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 1,
    defaultServiceDuration: 30,
    timeSlotInterval: 15
  },
  features: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    onlinePayments: true,
    reviews: true,
    loyaltyProgram: true
  }
};
