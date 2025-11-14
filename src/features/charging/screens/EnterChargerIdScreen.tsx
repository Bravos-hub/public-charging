/**
 * Enter Charger ID Screen (TypeScript)
 * Allows users to manually enter charger ID
 */

import React, { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function EnterChargerIdScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [chargerId, setChargerId] = useState('');
  const [error, setError] = useState('');

  function handleContinue(): void {
    // Validate charger ID: letters/numbers and hyphen, 4-24 chars
    const trimmed = chargerId.trim().toUpperCase();
    
    if (!trimmed) {
      setError('Please enter a charger ID');
      return;
    }

    if (trimmed.length < 4 || trimmed.length > 24) {
      setError('Charger ID must be between 4 and 24 characters');
      return;
    }

    if (!/^[A-Z0-9-]+$/.test(trimmed)) {
      setError('Charger ID can only contain letters, numbers, and hyphens');
      return;
    }

    setError('');
    
    // If user has a reservation with a future start, gate to Reservation Not Ready
    const start = route.params?.booking?.startTime || route.params?.startTime;
    if (start && Date.now() < new Date(start).getTime()) {
      push('RESERVATION_NOT_READY', {
        ...route.params,
        startTime: new Date(start),
      });
      return;
    }
    // Navigate to prepayment screen with the entered ID and connector data
    push('PREPAID_CHARGING', {
      ...route.params,
      chargerId: trimmed,
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value.toUpperCase();
    setChargerId(value);
    if (error) setError('');
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Activate — Enter ID</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Charger ID Input */}
        <div>
          <label className="block text-[12px] text-slate-600 mb-2">Charger ID</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <CreditCard className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={chargerId}
              onChange={handleInputChange}
              placeholder="e.g. EVZ-KLA-001-1"
              className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              maxLength={24}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Letters/numbers and hyphen, 4-24 chars. We'll auto-uppercase.
          </div>
          {error && (
            <div className="mt-2 text-[11px] text-rose-600">
              {error}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!chargerId.trim()}
          className="mt-6 w-full h-12 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{ backgroundColor: EVZ_COLORS.orange }}
        >
          Continue
        </button>
      </main>
    </div>
  );
}
