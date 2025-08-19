export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Barber Shop',
  appVersion: '1.0.0',
  enableAnalytics: false,
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
    pushNotifications: false,
    onlinePayments: false,
    reviews: true,
    loyaltyProgram: false
  }
};
