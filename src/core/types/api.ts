/**
 * API-related TypeScript types
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  statusText: string;
  message: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cash';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface Wallet {
  balance: number;
  currency: string;
  methods: PaymentMethod[];
}

