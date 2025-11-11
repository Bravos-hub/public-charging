/**
 * Application constants
 */

export const EVZ_COLORS = {
  green: '#03cd8c',
  orange: '#f77f00',
} as const;

export const CONNECTOR_TYPES = ['CCS2', 'Type2', 'CHAdeMO', 'NACS'] as const;

export const BOOKING_MODES = ['fixed', 'mobile'] as const;

export const SESSION_STATUSES = ['ready', 'charging', 'completed', 'stopped', 'error'] as const;

export const BOOKING_STATUSES = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'] as const;

