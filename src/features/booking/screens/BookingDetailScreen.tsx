/**
 * Booking Detail Screen (TypeScript)
 * Displays detailed information about a booking
 */

import React, { useMemo } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Car, Zap, Pencil, Trash2, Navigation2 } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import type { Booking } from '../../../core/types';

export function BookingDetailScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const booking: Booking | undefined = route.params?.booking;

  const data = useMemo(() => {
    if (booking) {
      const startDate = booking.startTime ? new Date(booking.startTime) : new Date();
      const endDate = booking.endTime 
        ? new Date(booking.endTime) 
        : new Date(startDate.getTime() + 90 * 60000); // Default 1.5 hours
      
      return {
        stationName: booking.stationName || 'Central Hub — Downtown Mall',
        date: startDate.toLocaleDateString(undefined, { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        time: `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} — ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`,
        vehicle: booking.vehicleName || 'Model X — UAX 123A',
        connector: booking.connectorType || 'CCS2 60kW',
      };
    }
    // Default values
    return {
      stationName: 'Central Hub — Downtown Mall',
      date: 'Sat, Nov 08, 2025',
      time: '03:29 PM — 04:59 PM',
      vehicle: 'Model X — UAX 123A',
      connector: 'CCS2 60kW',
    };
  }, [booking]);

  function handleModify(): void {
    // Navigate to time picker to modify booking
    if (booking?.stationId || booking?.stationName) {
      push('BOOK_FIXED_TIME', {
        stationId: booking?.stationId,
        stationName: booking?.stationName,
        booking,
      });
    }
  }

  function handleCancel(): void {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Handle cancellation logic here
      back();
    }
  }

  function handleNavigate(): void {
    // Navigate to station location
    if (booking?.location) {
      // Open maps with station location
      const url = `https://www.google.com/maps?q=${booking.location.lat},${booking.location.lng}`;
      window.open(url, '_blank');
    } else if (booking?.stationName) {
      // Fallback: search by station name
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.stationName)}`;
      window.open(url, '_blank');
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Booking Detail</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Booking Details Card */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Station Information */}
          <div className="mb-4">
            <div className="text-[12px] text-slate-500 mb-1">Station</div>
            <div className="flex items-center gap-2 text-[14px] font-semibold text-slate-800">
              <MapPin className="h-4 w-4 text-slate-600" />
              {data.stationName}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Section */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="h-4 w-4" />
                Date
              </div>
              <div className="text-[13px] font-semibold text-slate-800">{data.date}</div>
            </div>

            {/* Time Section */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                <Clock className="h-4 w-4" />
                Time
              </div>
              <div className="text-[13px] font-semibold text-slate-800">{data.time}</div>
            </div>

            {/* Vehicle Section */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                <Car className="h-4 w-4" />
                Vehicle
              </div>
              <div className="text-[13px] font-semibold text-slate-800">{data.vehicle}</div>
            </div>

            {/* Connector Section */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                <Zap className="h-4 w-4" />
                Connector
              </div>
              <div className="text-[13px] font-semibold text-slate-800">{data.connector}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={handleModify}
              className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              <Pencil className="h-4 w-4" />
              Modify
            </button>
            <button
              onClick={handleCancel}
              className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleNavigate}
              className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Navigation2 className="h-4 w-4" />
              Navigate
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

