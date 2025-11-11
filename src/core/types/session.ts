/**
 * Charging session-related TypeScript types
 */

export type SessionStatus = 'ready' | 'charging' | 'completed' | 'stopped' | 'error';

export interface ChargingSession {
  id: string;
  stationId: string;
  connectorId: string;
  bookingId?: string;
  startTime: Date | string;
  endTime?: Date | string;
  energyDelivered: number; // kWh
  cost: number;
  status: SessionStatus;
  power?: number; // Current power in kW
  estimatedCompletion?: Date | string;
  receiptId?: string;
}

export interface SessionEvent {
  type: 'started' | 'progress' | 'completed' | 'stopped' | 'error';
  timestamp: Date | string;
  data?: {
    energyDelivered?: number;
    power?: number;
    cost?: number;
    estimatedCompletion?: Date | string;
    error?: string;
  };
}

