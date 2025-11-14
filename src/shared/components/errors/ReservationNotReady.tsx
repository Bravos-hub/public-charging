import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, MapPin, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

function msToParts(ms: number): { h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s };
}

interface Props {
  stationName?: string;
  startTime?: Date | string | number; // when the reservation becomes active
  onViewBooking?: () => void;
  onOk?: () => void;
  onChangeTime?: () => void;
}

export function ReservationNotReady({
  stationName = 'Central Hub — Downtown Mall',
  startTime,
  onViewBooking,
  onOk,
  onChangeTime,
}: Props): React.ReactElement {
  const startAt = useMemo(() => {
    if (startTime instanceof Date) return startTime.getTime();
    if (typeof startTime === 'string' || typeof startTime === 'number') return new Date(startTime).getTime();
    return Date.now() + 7 * 60 * 1000 + 20 * 1000; // default demo countdown ~7m20s
  }, [startTime]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const parts = msToParts(startAt - now);
  const dateLabel = useMemo(() => {
    const date = new Date(startAt);
    const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
    const month = date.toLocaleDateString(undefined, { month: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${weekday}, ${month} ${day}, ${year}`;
  }, [startAt]);
  const timeLabel = useMemo(() => new Date(startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), [startAt]);

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green banner at the top */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-green-600" />
        </div>
        <span className="text-white font-semibold">Reservation Not Ready</span>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Light yellow/cream warning box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900">It's a bit early to start.</div>
              <div className="text-xs text-amber-800 mt-1">Your session hasn't opened yet. You can start when the reserved window begins.</div>
            </div>
          </div>
        </div>

        {/* Station details card */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white">
          {/* Station information */}
          <div className="mb-4">
            <div className="text-[11px] text-slate-600 mb-1">Station</div>
            <div className="text-[13px] font-semibold inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-900" />
              <span>{stationName}</span>
            </div>
          </div>

          {/* Scheduled start and countdown side by side */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Scheduled start sub-card */}
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] text-slate-600 mb-2 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Scheduled start</span>
              </div>
              <div className="text-[13px] font-semibold text-slate-900">{dateLabel}</div>
              <div className="text-[12px] text-slate-700 mt-1">{timeLabel}</div>
            </div>

            {/* Opens in countdown sub-card */}
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] text-slate-600 mb-2">Opens in</div>
              <div className="text-xl font-bold text-blue-600">
                {String(parts.h).padStart(2, '0')}:{String(parts.m).padStart(2, '0')}:{String(parts.s).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Informational note */}
          <div className="text-xs text-slate-600 flex items-start gap-2 pt-2 border-t border-slate-100">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>You'll also find this countdown in Activity → Bookings.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={onViewBooking} className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            View Booking
          </button>
          <button onClick={onOk} className="h-10 rounded-xl text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-colors">
            OK
          </button>
        </div>
        <div className="mt-3">
          <button onClick={onChangeTime} className="h-10 w-full rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Change Time
          </button>
        </div>
      </div>
    </div>
  );
}
