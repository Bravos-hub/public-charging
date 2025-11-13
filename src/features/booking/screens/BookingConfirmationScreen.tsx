/**
 * Booking Confirmation Screen (TypeScript)
 */

import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  Zap,
  Share2,
  CalendarPlus,
  Navigation2,
} from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { Booking } from '../../../core/types';

interface BookingConfirmationScreenProps {
  booking?: Booking;
  onAddToCalendar?: () => void;
  onDirections?: () => void;
  onViewBooking?: () => void;
  onShare?: () => void;
  onDone?: () => void;
}

export function BookingConfirmationScreen({
  booking,
  onAddToCalendar,
  onDirections,
  onViewBooking,
  onShare,
  onDone,
}: BookingConfirmationScreenProps): React.ReactElement {
  const data = useMemo(() => {
    if (booking) {
      const startDate = new Date(booking.startTime);
      const endDate = booking.endTime ? new Date(booking.endTime) : new Date(startDate.getTime() + 90 * 60000);
      return {
        station: booking.stationName || booking.location?.address || 'Central Hub — Downtown Mall',
        address: booking.stationAddress || booking.location?.address || 'Plot 10 Main St, Kampala, UG',
        date: startDate.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
        time: `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        vehicle: booking.vehicleName || 'Model X — UAX 123A',
        connector: booking.connectorType || 'CCS2 60kW',
        ref: booking.id || 'RSV-7B8C-20251120-1500',
      };
    }
    return {
      station: 'Central Hub — Downtown Mall',
      address: 'Plot 10 Main St, Kampala, UG',
      date: 'Thu, 20 Nov 2025',
      time: '15:00 — 16:30',
      vehicle: 'Model X — UAX 123A',
      connector: 'CCS2 60kW',
      ref: 'RSV-7B8C-20251120-1500',
    };
  }, [booking]);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center text-white">
          <CheckCircle2 className="h-5 w-5" />
          <span className="ml-2 font-semibold">Reservation Confirmed</span>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-28">
        {/* Success card */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-start gap-2" style={{ color: '#166534' }}>
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold">You're all set!</div>
              <div className="text-[12px] mt-0.5" style={{ color: '#166534', opacity: 0.9 }}>Show up on time to keep your slot.</div>
            </div>
          </div>
          <div className="mt-2 text-[11px]" style={{ color: '#166534', opacity: 0.8 }}>Reference: {data.ref}</div>
        </div>

        {/* Station Details */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-[12px] text-slate-600 mb-2">Station</div>
          <div className="flex items-start gap-2 text-[14px] font-semibold text-slate-800">
            <MapPin className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
            <span>{data.station}</span>
          </div>
          <div className="text-[12px] text-slate-600 mt-1 ml-6">{data.address}</div>
              </div>

        {/* Date & Time and Vehicle Cards */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <Clock className="h-3.5 w-3.5" />
              <span>Date & Time</span>
            </div>
            <div className="text-[13px] font-semibold text-slate-800">{data.date}</div>
            <div className="text-[12px] text-slate-600 mt-0.5">{data.time}</div>
              </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
              <Car className="h-3.5 w-3.5" />
              <span>Vehicle</span>
              </div>
            <div className="text-[13px] font-semibold text-slate-800">{data.vehicle}</div>
            <div className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {data.connector}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2 text-[13px] font-medium"
            onClick={onAddToCalendar}
          >
            <CalendarPlus className="h-4 w-4" />
            Add to Calendar
          </button>
          <button
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2 text-[13px] font-medium"
            onClick={onDirections}
          >
            <Navigation2 className="h-4 w-4" />
            Directions
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 text-[13px] font-medium"
            onClick={onViewBooking}
          >
            View Booking
          </button>
          <button
            className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 text-[13px]"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
        <div className="mt-3">
          <button
            className="h-12 w-full rounded-xl text-white font-medium text-[14px]"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onDone}
          >
            Done
          </button>
        </div>
      </main>
    </div>
  );
}

