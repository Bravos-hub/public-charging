/**
 * Charging Ready Screen (TypeScript)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, MapPin, Zap } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

interface ChargingReadyScreenProps {
  onStart?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ChargingReadyScreen({ onStart, onBack, onCancel }: ChargingReadyScreenProps): React.ReactElement {
  const { route } = useNavigation();
  
  // Get station and connector data from route params
  const station = route.params?.station || {
    name: route.params?.stationName || 'Central Hub — Downtown Mall',
  };
  
  const connector = route.params?.connector || {
    type: route.params?.connectorType || 'CCS2',
    power: route.params?.connectorPower || 60,
  };
  
  // Get charger/EVSE ID from various possible sources
  const chargerId = route.params?.chargerId 
    || route.params?.scanResult?.evseId 
    || route.params?.evseId 
    || 'EVZ-123';
  
  // Auto-cancel countdown: 5 minutes (300 seconds)
  const [countdown, setCountdown] = useState(300);
  
  useEffect(() => {
    if (countdown <= 0) {
      onCancel?.();
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCancel?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, onCancel]);
  
  const countdownDisplay = useMemo(() => formatCountdown(countdown), [countdown]);
  const connectorDisplay = `${connector.type} ${connector.power}kW`;

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header Banner */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center gap-2 text-white">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Ready: Waiting to Plug In</span>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Station and Connector Info Card */}
        <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-slate-800">
            <MapPin className="h-4 w-4 text-slate-600" />
            <span className="text-[14px] font-semibold">{station.name}</span>
          </div>
          <div className="mt-2 text-[12px] text-slate-500">
            EVSE {chargerId} • Connector {connectorDisplay}
          </div>
          
          {/* Auto-cancel Countdown */}
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: '#E0F2FE' }}>
            <div className="text-[11px] font-medium" style={{ color: '#0369A1' }}>
              Auto-cancel in
            </div>
            <div className="mt-1 text-2xl font-bold" style={{ color: '#0369A1' }}>
              {countdownDisplay}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
            <button
            className="h-12 px-4 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
              onClick={onStart}
            >
            <Zap className="h-4 w-4" />
            Start Now
          </button>
          <button
            className="h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
            onClick={onCancel || onBack}
          >
            Cancel
            </button>
        </div>
      </main>
    </div>
  );
}

