/**
 * API SDK Client (TypeScript)
 * Thin SDK for REST + SSE with retry/backoff
 */

import type { Booking, BookingDraft, ChargingSession, Station, PaymentIntent } from '../types';
import { createSseClient, type Unsubscribe } from './sse';

export type GetToken = () => string | null;

export interface Sdk {
  stations: {
    list: (query?: string) => Promise<Station[]>;
    byId: (id: string) => Promise<Station>;
  };
  bookings: {
    create: (booking: BookingDraft) => Promise<Booking>;
    modify: (id: string, booking: Partial<BookingDraft>) => Promise<Booking>;
    cancel: (id: string) => Promise<void>;
  };
  sessions: {
    start: (data: { stationId: string; connectorId: string; bookingId?: string }) => Promise<ChargingSession>;
    stop: (id: string) => Promise<ChargingSession>;
    get: (id: string) => Promise<ChargingSession>;
    stream: (id: string, onEvent: (data: any) => void) => Unsubscribe;
  };
  payments: {
    intent: (data: { amount: number; currency: string }) => Promise<PaymentIntent>;
    confirm: (data: { intentId: string; paymentMethodId: string }) => Promise<PaymentIntent>;
    refund: (data: { paymentId: string; amount?: number }) => Promise<PaymentIntent>;
  };
  realtime: {
    subscribe: (onEvent: (data: any) => void) => Unsubscribe;
  };
}

export function createSdk(getToken: GetToken): Sdk {
  if (typeof getToken !== 'function') {
    throw new Error('createSdk expects getToken: () => string | null');
  }

  const BASE =
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || '/api';

  async function req<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.headers as Record<string, string> || {}),
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (typeof fetch !== 'function') {
      throw new Error('fetch is not available in this environment');
    }

    const baseUrl = BASE.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}${path}`, { ...opts, headers: headers as HeadersInit });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return res.status === 204 ? (null as T) : res.json();
  }

  function sse(path: string, onEvent: (data: any) => void): Unsubscribe {
    const token = getToken();
    const base = BASE.replace(/\/$/, '');
    const url = token
      ? `${base}${path}?token=${encodeURIComponent(token)}`
      : `${base}${path}`;

    if (typeof EventSource !== 'function') {
      return () => {};
    }

    return createSseClient(url, { onEvent });
  }

  return {
    stations: {
      list: (q = '') => req<Station[]>(`/v1/stations${q}`),
      byId: (id: string) => req<Station>(`/v1/stations/${id}`),
    },
    bookings: {
      create: (b: BookingDraft) =>
        req<Booking>('/v1/reservations', {
          method: 'POST',
          body: JSON.stringify(b),
        }),
      modify: (id: string, b: Partial<BookingDraft>) =>
        req<Booking>(`/v1/reservations/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(b),
        }),
      cancel: (id: string) => req<void>(`/v1/reservations/${id}`, { method: 'DELETE' }),
    },
    sessions: {
      start: (data: { stationId: string; connectorId: string; bookingId?: string }) =>
        req<ChargingSession>('/v1/sessions/start', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      stop: (id: string) => req<ChargingSession>(`/v1/sessions/${id}/stop`, { method: 'POST' }),
      get: (id: string) => req<ChargingSession>(`/v1/sessions/${id}`),
      stream: (id: string, on: (data: any) => void) => sse(`/v1/sessions/${id}/events`, on),
    },
    payments: {
      intent: (data: { amount: number; currency: string }) =>
        req<PaymentIntent>('/v1/payments/intent', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      confirm: (data: { intentId: string; paymentMethodId: string }) =>
        req<PaymentIntent>('/v1/payments/confirm', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      refund: (data: { paymentId: string; amount?: number }) =>
        req<PaymentIntent>('/v1/payments/refund', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
    },
    realtime: {
      subscribe: (on: (data: any) => void) => sse('/v1/realtime', on),
    },
  };
}

