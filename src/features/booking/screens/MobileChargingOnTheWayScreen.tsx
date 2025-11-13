/**
 * Mobile Charging On The Way Screen (TypeScript)
 * Shows status when mobile charger is en route to the user's location
 */

import React, { useMemo } from 'react';
import { Car, MapPin, Phone, MessageCircle, Clock } from 'lucide-react';
import { useNavigation } from '../../../core';

export function MobileChargingOnTheWayScreen(): React.ReactElement {
  const { route } = useNavigation();
  
  // Get location from route params or use default
  const location = route.params?.location || 'Plot 10 Main St, Kampala (0.31400, 32.58200)';
  
  // Calculate estimated arrival time (default: 15 minutes from now)
  const estimatedArrival = useMemo(() => {
    const now = new Date();
    const arrival = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  function handleCallDriver(): void {
    // In a real app, this would initiate a phone call
    console.log('Calling driver...');
    // Could use tel: link or phone call API
  }

  function handleMessage(): void {
    // In a real app, this would open messaging
    console.log('Opening message...');
    // Could navigate to messaging screen or open SMS
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green banner at the top */}
      <div className="bg-green-600 px-4 py-3 flex items-center gap-2">
        <Car className="h-5 w-5 text-white" />
        <span className="text-white font-semibold">Mobile charging on the way</span>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Location card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-[11px] text-slate-600 mb-2">Location</div>
          <div className="text-[13px] font-medium inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-900" />
            <span className="text-slate-900">{location}</span>
          </div>
        </div>

        {/* Estimated arrival card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-[11px] text-slate-600 text-center mb-3">Estimated arrival</div>
          <div className="text-4xl font-bold text-slate-900 text-center">
            {estimatedArrival}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleCallDriver}
            className="h-11 rounded-xl bg-orange-500 text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>Call Driver</span>
          </button>
          <button
            onClick={handleMessage}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </button>
        </div>

        {/* Informational note */}
        <div className="text-xs text-slate-600 flex items-start gap-2">
          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Please ensure access/parking is available.</span>
        </div>
      </div>
    </div>
  );
}

