/**
 * Contact / Support Screen (TypeScript)
 * Allows users to contact support for booking-related issues
 */

import React, { useMemo } from 'react';
import { ArrowLeft, Headphones, Phone, MessageCircle, Mail, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function ContactSupportScreen(): React.ReactElement {
  const { route, back } = useNavigation();

  // Get booking and station data from route params
  const booking = route.params?.booking;
  const station = route.params?.station;

  // Generate booking reference ID
  const bookingRef = useMemo(() => {
    if (booking?.id) {
      // Format: MBK-YYYY-MMDD-HHMM
      const date = booking.startTime ? new Date(booking.startTime) : new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `MBK-${year}-${month}${day}-${hour}${min}`;
    }
    return 'MBK-2025-1106-1530';
  }, [booking]);

  const stationName = booking?.stationName || station?.name || 'Central Hub — Downtown Mall';
  const phoneNumber = station?.phone || '+256 700 000 001';

  function handleCall(): void {
    window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
  }

  function handleOpenChat(): void {
    // In a real app, this would open a chat interface
    alert('Chat feature coming soon!');
  }

  function handleEmailSupport(): void {
    const subject = encodeURIComponent(`Support Request - Booking ${bookingRef}`);
    const body = encodeURIComponent(`Booking Reference: ${bookingRef}\nStation: ${stationName}\n\nPlease describe your issue:`);
    window.location.href = `mailto:support@evzone.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            <span className="font-semibold">Contact / Support</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Booking Reference Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-[12px] text-slate-500 mb-1">Booking reference</div>
          <div className="text-[16px] font-semibold text-slate-800 mb-2">{bookingRef}</div>
          <div className="text-[13px] text-slate-600">Station: {stationName}</div>
        </div>

        {/* Contact Options */}
        <div className="space-y-3">
          {/* Call Button */}
          <button
            onClick={handleCall}
            className="w-full h-14 rounded-xl text-white font-medium inline-flex items-center justify-center gap-3 text-[14px]"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            <Phone className="h-5 w-5" />
            Call {phoneNumber}
          </button>

          {/* Open Chat Button */}
          <button
            onClick={handleOpenChat}
            className="w-full h-14 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium inline-flex items-center justify-center gap-3 text-[14px]"
          >
            <MessageCircle className="h-5 w-5" />
            Open Chat
          </button>

          {/* Email Support Button */}
          <button
            onClick={handleEmailSupport}
            className="w-full h-14 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium inline-flex items-center justify-center gap-3 text-[14px]"
          >
            <Mail className="h-5 w-5" />
            Email Support
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-6 flex items-start gap-2 text-[11px] text-slate-500">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>For urgent issues, please call the station operator directly.</span>
        </div>
      </main>
    </div>
  );
}

