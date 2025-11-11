/**
 * Activity & History Screen (TypeScript)
 * Unified screen with bookings and history tabs
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  MapPin,
  Clock3,
  PlugZap,
  Gauge,
  Receipt,
  Filter,
  Share2,
  FileDown,
  CalendarX2,
  QrCode,
  SearchX,
} from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import type { Booking, ChargingSession } from '../../../core/types';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  primary?: string;
  onPrimary?: () => void;
  secondary?: string;
  onSecondary?: () => void;
  children?: React.ReactNode;
}

function EmptyState({
  icon: Icon,
  title,
  desc,
  primary,
  onPrimary,
  secondary,
  onSecondary,
  children,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white text-center" aria-live="polite">
      <div className="mx-auto h-11 w-11 rounded-xl grid place-items-center bg-slate-50 text-slate-700">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div className="mt-3 text-[14px] font-semibold text-slate-800">{title}</div>
      {desc && <div className="mt-1 text-[12px] text-slate-600">{desc}</div>}
      {children}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {primary && (
          <button
            onClick={onPrimary}
            className="h-10 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            {primary}
          </button>
        )}
        {secondary && (
          <button
            onClick={onSecondary}
            className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700"
          >
            {secondary}
          </button>
        )}
      </div>
    </div>
  );
}

function msToParts(ms: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s };
}

function useCountdown(targetMs: number): { d: number; h: number; m: number; s: number } {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => msToParts(targetMs - now), [targetMs, now]);
}

interface ScheduledCardProps {
  item: {
    station: string;
    dateLabel: string;
    connector: string;
    id?: string;
  };
  onDetails?: (item: ScheduledCardProps['item']) => void;
  onCancel?: (item: ScheduledCardProps['item']) => void;
}

function ScheduledCard({ item, onDetails, onCancel }: ScheduledCardProps): React.ReactElement {
  return (
    <div className="p-3 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-800 truncate">{item.station}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{item.dateLabel}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
            <PlugZap className="h-3.5 w-3.5" />
            <span>{item.connector}</span>
          </div>
        </div>
        <div className="grid gap-2">
          <button
            onClick={() => onDetails?.(item)}
            className="h-8 px-3 rounded-lg text-white text-[12px] font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Details
          </button>
          <button
            onClick={() => onCancel?.(item)}
            className="h-8 px-3 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityBookingsEmbedded(): React.ReactElement {
  const { push } = useNavigation();
  const [upcomingBooking, setUpcomingBooking] = useState<{
    station: string;
    when: Date;
    vehicle: string;
    connector: string;
    id: string;
  } | null>(() => {
    const upcomingStart = Date.now() + 2 * 60 * 1000 + 15 * 1000;
    return {
      station: 'Central Hub — Downtown Mall',
      when: new Date(upcomingStart),
      vehicle: 'Model X — UAX 123A',
      connector: 'CCS2 60kW',
      id: 'upcoming-001',
    };
  });

  const [scheduledBookings, setScheduledBookings] = useState(() => {
    const base = new Date();
    const mk = (offsetMin: number, id: string) => {
      const d = new Date(base.getTime() + offsetMin * 60 * 1000);
      return {
        id,
        station: offsetMin % 2 ? 'Airport Park — Lot B' : 'City Square — Tower A',
        connector: offsetMin % 2 ? 'Type 2 22kW' : 'CCS2 60kW',
        dateLabel:
          d.toLocaleDateString(undefined, {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) +
          ' • ' +
          d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    };
    return [mk(180, 'scheduled-001'), mk(360, 'scheduled-002'), mk(540, 'scheduled-003')];
  });

  const upcomingStart = upcomingBooking ? upcomingBooking.when.getTime() : Date.now();
  const parts = useCountdown(upcomingStart);
  const dateLabel = useMemo(
    () =>
      upcomingBooking
        ? upcomingBooking.when.toLocaleDateString(undefined, {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) +
          ' • ' +
          upcomingBooking.when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
    [upcomingBooking]
  );

  function handleCancelUpcoming(): void {
    if (window.confirm('Are you sure you want to cancel this upcoming booking?')) {
      setUpcomingBooking(null);
    }
  }

  function handleOpenDetailsUpcoming(): void {
    if (upcomingBooking) {
      push('BOOK_DETAIL', {
        booking: {
          id: upcomingBooking.id,
          stationName: upcomingBooking.station,
          vehicleName: upcomingBooking.vehicle,
          connectorType: upcomingBooking.connector,
          startTime: upcomingBooking.when,
        },
      });
    }
  }

  function handleScheduledDetails(item: ScheduledCardProps['item']): void {
    push('BOOK_DETAIL', {
      booking: {
        id: item.id || `booking-${item.station}`,
        stationName: item.station,
        connectorType: item.connector,
      },
    });
  }

  function handleScheduledCancel(item: ScheduledCardProps['item']): void {
    if (window.confirm(`Are you sure you want to cancel the booking at ${item.station}?`)) {
      setScheduledBookings((prev) => prev.filter((b) => b.id !== item.id));
    }
  }

  const firstTimeEmpty = scheduledBookings.length === 0 && !upcomingBooking;

  return (
    <section className="max-w-md mx-auto px-4 py-4 pb-24">
      {/* Upcoming highlight */}
      {upcomingBooking && (
        <div className="p-4 rounded-2xl bg-blue-600 text-white">
          <div className="text-[12px] uppercase tracking-wide opacity-90">Upcoming</div>
          <div className="mt-1 text-[14px] font-semibold">{upcomingBooking.station}</div>
          <div className="mt-1 text-[12px] opacity-90 flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {dateLabel}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xl font-bold">{parts.d}</div>
              <div className="text-[11px] opacity-90">d</div>
            </div>
            <div>
              <div className="text-xl font-bold">{parts.h}</div>
              <div className="text-[11px] opacity-90">h</div>
            </div>
            <div>
              <div className="text-xl font-bold">{parts.m}</div>
              <div className="text-[11px] opacity-90">m</div>
            </div>
            <div>
              <div className="text-xl font-bold">{parts.s}</div>
              <div className="text-[11px] opacity-90">s</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleCancelUpcoming}
              className="h-10 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenDetailsUpcoming}
              className="h-10 rounded-xl text-blue-700 bg-white font-medium hover:bg-blue-50 transition-colors"
            >
              Open Details
            </button>
          </div>
        </div>
      )}

      {/* Scheduled list OR empty state */}
      {scheduledBookings.length > 0 ? (
        <>
          <div className="mt-5 mb-2 text-[12px] font-semibold text-slate-600">Scheduled</div>
          <div className="space-y-3">
            {scheduledBookings.map((it) => (
              <ScheduledCard
                key={it.id}
                item={it}
                onDetails={handleScheduledDetails}
                onCancel={handleScheduledCancel}
              />
            ))}
          </div>
        </>
      ) : firstTimeEmpty ? (
        <div className="mt-4">
          <EmptyState
            icon={CalendarClock}
            title="No bookings yet"
            desc="When you schedule a session, it will show here."
            primary="Book a session"
            onPrimary={() => push('BOOK_FIXED_TIME')}
            secondary="Discover chargers"
            onSecondary={() => push('DISCOVER')}
          >
            <div className="mt-3 text-[12px] text-slate-600">
              Or scan a charger QR to start now.
              <button
                onClick={() => push('ACTIVATION_SCAN')}
                className="ml-1 inline-flex items-center gap-1 text-emerald-700 font-medium"
              >
                <QrCode className="h-3.5 w-3.5" /> Scan QR
              </button>
            </div>
          </EmptyState>
        </div>
      ) : null}
    </section>
  );
}

interface SessionRowProps {
  item: {
    station: string;
    dateLabel: string;
    energy: number;
    duration: string;
    total: number;
  };
}

function SessionRow({ item }: SessionRowProps): React.ReactElement {
  const formatMoney = (n: number): string => `UGX ${n.toLocaleString()}`;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[12px] text-slate-600">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{item.dateLabel}</span>
          </div>
          <div className="mt-1 flex items-start gap-2 text-[13px] font-semibold text-slate-800">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{item.station}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {item.energy} kWh
            </div>
            <div className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {item.duration}
            </div>
            <div className="text-right font-medium text-slate-800">{formatMoney(item.total)}</div>
          </div>
        </div>
        <div className="grid gap-2 shrink-0">
          <button
            className="h-9 px-3 rounded-lg text-white text-[12px] font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            <Receipt className="h-3.5 w-3.5 inline mr-1" /> Receipt
          </button>
          <button className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700">
            <Share2 className="h-3.5 w-3.5 inline mr-1" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

function HistorySessionsEmbedded(): React.ReactElement {
  const { push } = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const all = useMemo(() => {
    const now = new Date();
    const mk = (
      offsetDays: number,
      energy: number,
      minutes: number,
      total: number,
      station: string
    ) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetDays, 14, 5);
      return {
        station,
        energy,
        duration: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
        total,
        date: d,
        dateLabel:
          d.toLocaleDateString(undefined, {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) +
          ' • ' +
          d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    };
    return [
      mk(1, 18.4, 38, 55200, 'Central Hub — Downtown Mall'),
      mk(3, 9.2, 20, 27600, 'Airport Park — Lot B'),
      mk(8, 32.1, 50, 96300, 'City Square — Tower A'),
      mk(12, 22.7, 44, 68100, 'Business Park — Block C'),
    ];
  }, []);

  const filtered = useMemo(() => {
    const f = from ? new Date(from) : null;
    const t = to ? new Date(to) : null;
    return all.filter((x) => (!f || x.date >= f) && (!t || x.date <= t));
  }, [all, from, to]);

  const firstTimeEmpty = all.length === 0;
  const filterEmpty = !firstTimeEmpty && filtered.length === 0;

  return (
    <section className="max-w-md mx-auto px-4 py-4 pb-28">
      {/* Filters */}
      <div className="p-3 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-[12px] text-slate-600">
          <Filter className="h-4 w-4" /> Filter by date
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10 px-2 rounded-lg border border-slate-300"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-10 px-2 rounded-lg border border-slate-300"
          />
        </div>
      </div>

      {/* Lists & empty states */}
      {firstTimeEmpty ? (
        <div className="mt-4">
          <EmptyState
            icon={CalendarX2}
            title="No charging history yet"
            desc="Your receipts and sessions will appear once you complete a charge."
            primary="Book your first charge"
            onPrimary={() => push('BOOK_FIXED_TIME')}
            secondary="Discover chargers"
            onSecondary={() => push('DISCOVER')}
          />
        </div>
      ) : filterEmpty ? (
        <div className="mt-4">
          <EmptyState
            icon={SearchX}
            title="No sessions match these dates"
            desc="Try adjusting your date range or clearing filters."
            primary="Clear filters"
            onPrimary={() => {
              setFrom('');
              setTo('');
            }}
            secondary="Share summary"
            onSecondary={() => {
              /* no-op in preview */
            }}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {filtered.map((it, idx) => (
              <SessionRow key={idx} item={it} />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">
              <FileDown className="h-4 w-4 inline mr-2" /> Export
            </button>
            <button
              className="h-11 rounded-xl text-white font-medium"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              <Share2 className="h-4 w-4 inline mr-2" /> Share Summary
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export function ActivityScreen(): React.ReactElement {
  const [tab, setTab] = useState<'activity' | 'history'>('activity');

  return (
    <div className="w-full bg-white text-slate-900">

      {/* Toggle */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="p-1 rounded-xl bg-slate-100 grid grid-cols-2">
          <button
            onClick={() => setTab('activity')}
            className={`h-9 rounded-lg font-medium ${
              tab === 'activity'
                ? 'bg-white shadow text-emerald-700'
                : 'text-slate-600'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setTab('history')}
            className={`h-9 rounded-lg font-medium ${
              tab === 'history' ? 'bg-white shadow text-emerald-700' : 'text-slate-600'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Panels */}
      <div>{tab === 'activity' ? <ActivityBookingsEmbedded /> : <HistorySessionsEmbedded />}</div>
    </div>
  );
}

