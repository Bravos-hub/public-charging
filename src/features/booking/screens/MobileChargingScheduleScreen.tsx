/**
 * Mobile Charging Schedule Screen (TypeScript)
 * Calendly-style booking interface for mobile charging sessions
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Globe2,
  Bell,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

interface TimeSlot {
  id: string;
  hour: number;
  minute: number;
}

interface MonthCell {
  date: Date;
  inCurrentMonth: boolean;
}

interface Booking {
  dateKey: string;
  startMinutes: number;
  endMinutes: number;
}

const TIME_ZONES = [
  {
    id: 'Africa/Kampala',
    label: 'East Africa Time – EAT (GMT+3)',
  },
  {
    id: 'America/New_York',
    label: 'Eastern Time – US & Canada (GMT-5 / -4)',
  },
  {
    id: 'Europe/London',
    label: 'London – GMT / BST',
  },
  {
    id: 'Asia/Shanghai',
    label: 'China Standard Time – CST (GMT+8)',
  },
];

const DURATION_OPTIONS = [30, 45, 60, 90];

function cx(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatMonthYear(year: number, monthIndex: number): string {
  const d = new Date(year, monthIndex, 1);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatLongDate(date: Date | null): string {
  if (!date) return 'Pick a date';
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(date: Date | null): string {
  if (!date) return '';
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mm = minutes.toString().padStart(2, '0');
  return `${hours}:${mm}${ampm}`;
}

function formatTimeFromMinutes(totalMinutes: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMinutes(totalMinutes);
  return formatTime(d);
}

function formatDuration(minutes: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function stripTime(date: Date): Date {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildMonthGrid(year: number, month: number): MonthCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: MonthCell[] = [];
  for (let i = 0; i < 42; i++) {
    const dayNumber = i - firstDayOfWeek + 1;
    let date: Date;
    let inCurrentMonth: boolean;

    if (dayNumber <= 0) {
      date = new Date(year, month - 1, daysInPrevMonth + dayNumber);
      inCurrentMonth = false;
    } else if (dayNumber > daysInMonth) {
      date = new Date(year, month + 1, dayNumber - daysInMonth);
      inCurrentMonth = false;
    } else {
      date = new Date(year, month, dayNumber);
      inCurrentMonth = true;
    }

    cells.push({ date, inCurrentMonth });
  }
  return cells;
}

function generateTimeSlots(startHour = 8, endHour = 20, intervalMinutes = 30): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = startHour * 60;
  const end = endHour * 60;

  for (let minutes = start; minutes <= end - intervalMinutes; minutes += intervalMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push({
      id: `${h}:${m}`,
      hour: h,
      minute: m,
    });
  }
  return slots;
}

const ALL_SLOTS = generateTimeSlots(8, 20, 30);

// Replace with real bookings from backend
const EXISTING_BOOKINGS: Booking[] = [];

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function findOverlappingBooking(
  date: Date,
  startMinutes: number,
  endMinutes: number
): Booking | undefined {
  const key = getDateKey(date);
  return EXISTING_BOOKINGS.find((b) => {
    if (b.dateKey !== key) return false;
    const latestStart = Math.max(b.startMinutes, startMinutes);
    const earliestEnd = Math.min(b.endMinutes, endMinutes);
    return latestStart < earliestEnd;
  });
}

function MonthGrid({
  monthGrid,
  today,
  selectedDate,
  onSelectDate,
}: {
  monthGrid: MonthCell[];
  today: Date;
  selectedDate: Date | null;
  onSelectDate: (cell: MonthCell) => void;
}): React.ReactElement {
  return (
    <div className="mt-1 grid grid-cols-7 gap-1 text-xs">
      {monthGrid.map((cell, idx) => {
        const dateOnly = stripTime(cell.date);
        const isPast = dateOnly.getTime() < today.getTime();
        const isToday = isSameDay(dateOnly, today);
        const isSelected = selectedDate && isSameDay(dateOnly, selectedDate);

        const disabled = !cell.inCurrentMonth || isPast;

        const baseClasses = 'relative flex h-8 items-center justify-center rounded-full text-[11px]';

        const stateClasses = disabled
          ? 'text-slate-300'
          : isSelected
          ? 'text-white'
          : isToday
          ? 'border text-slate-900'
          : cell.inCurrentMonth
          ? 'text-slate-700 hover:bg-slate-100'
          : 'text-slate-300';

        const style = isSelected
          ? {
              backgroundColor: EVZ_COLORS.green,
              borderColor: EVZ_COLORS.green,
              color: 'white',
            }
          : isToday
          ? {
              borderColor: EVZ_COLORS.green,
              color: EVZ_COLORS.green,
            }
          : undefined;

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectDate(cell)}
            className={cx(baseClasses, stateClasses)}
            style={style}
          >
            {cell.date.getDate()}
          </button>
        );
      })}
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cx(
        'inline-flex h-5 w-9 items-center rounded-full border px-0.5 transition',
        enabled
          ? 'border-emerald-500 bg-emerald-500'
          : 'border-slate-300 bg-slate-200'
      )}
    >
      <span
        className={cx(
          'h-3.5 w-3.5 rounded-full bg-white shadow-sm transition',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
}

export function MobileChargingScheduleScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const today = useMemo(() => stripTime(new Date()), []);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [timeZoneId, setTimeZoneId] = useState('Africa/Kampala');

  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsOffsetHours, setSmsOffsetHours] = useState(24);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailOffsetHours, setEmailOffsetHours] = useState(2);

  const [durationPickerOpen, setDurationPickerOpen] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(45);
  const [conflictMessage, setConflictMessage] = useState('');

  const [step, setStep] = useState<1 | 2>(1); // 1 = pick date, 2 = pick time & confirm

  const monthGrid = useMemo(() => buildMonthGrid(currentYear, currentMonth), [currentYear, currentMonth]);

  const selectedSlot = useMemo(
    () => ALL_SLOTS.find((s) => s.id === selectedSlotId) || null,
    [selectedSlotId]
  );

  const selectedStartDateTime = useMemo(() => {
    if (!selectedDate || !selectedSlot) return null;
    return new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedSlot.hour,
      selectedSlot.minute
    );
  }, [selectedDate, selectedSlot]);

  const selectedEndDateTime = useMemo(() => {
    if (!selectedStartDateTime) return null;
    return new Date(selectedStartDateTime.getTime() + durationMinutes * 60000);
  }, [selectedStartDateTime, durationMinutes]);

  const selectedRange = useMemo(() => {
    if (!selectedSlot) return null;
    const startMinutes = selectedSlot.hour * 60 + selectedSlot.minute;
    return {
      startMinutes,
      endMinutes: startMinutes + durationMinutes,
    };
  }, [selectedSlot, durationMinutes]);

  const activeTimeZone = TIME_ZONES.find((z) => z.id === timeZoneId) || TIME_ZONES[0];

  const location = route.params?.location || 'Your current EV location';

  useEffect(() => {
    if (!selectedDate || !selectedSlot) {
      setConflictMessage('');
      return;
    }
    const slotDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedSlot.hour,
      selectedSlot.minute
    );
    const startMinutes = selectedSlot.hour * 60 + selectedSlot.minute;
    const endMinutes = startMinutes + durationMinutes;
    const conflict = findOverlappingBooking(slotDate, startMinutes, endMinutes);
    if (conflict) {
      const conflictStart = formatTimeFromMinutes(conflict.startMinutes);
      const conflictEnd = formatTimeFromMinutes(conflict.endMinutes);
      setConflictMessage(`This time overlaps with another booking from ${conflictStart}–${conflictEnd}.`);
    } else {
      setConflictMessage('');
    }
  }, [selectedDate, selectedSlot, durationMinutes]);

  function goToPreviousMonth(): void {
    const newMonth = currentMonth - 1;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth(newMonth);
    }
  }

  function goToNextMonth(): void {
    const newMonth = currentMonth + 1;
    if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  }

  function handleSelectDate(cell: MonthCell): void {
    const dateOnly = stripTime(cell.date);
    const isPast = dateOnly.getTime() < today.getTime();
    if (!cell.inCurrentMonth || isPast) return;
    setSelectedDate(dateOnly);
    setSelectedSlotId(null);
  }

  function handleSelectSlot(slot: TimeSlot): void {
    if (!selectedDate) return;
    const slotDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      slot.hour,
      slot.minute
    );
    const isPast = slotDate.getTime() < Date.now();
    if (isPast) return;
    setSelectedSlotId(slot.id === selectedSlotId ? null : slot.id);
  }

  function applyCustomDuration(): void {
    const total = customHours * 60 + customMinutes;
    if (total > 0) {
      setDurationMinutes(total);
      setDurationPickerOpen(false);
    }
  }

  function handleConfirmSession(): void {
    if (!selectedStartDateTime || !selectedEndDateTime || conflictMessage) return;

    // Create booking object
    const booking = {
      id: `BOOK-${Date.now()}`,
      stationId: route.params?.stationId,
      stationName: location,
      startTime: selectedStartDateTime,
      endTime: selectedEndDateTime,
      connectorType: 'CCS2',
      status: 'pending' as const,
      mode: 'mobile' as const,
      vehicleId: route.params?.vehicleId,
      vehicleName: route.params?.vehicleName,
    };

    push('BOOK_FEE_PAYMENT', {
      booking,
      location,
      vehicle: route.params?.vehicle,
      durationMinutes,
      timeZoneId,
      reminders: {
        smsEnabled,
        smsOffsetHours,
        emailEnabled,
        emailOffsetHours,
      },
    });
  }

  const canGoNext = !!selectedDate;

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button className="inline-flex items-center gap-2" aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Schedule Mobile Charging</span>
          <div className="w-5" />
        </div>
      </div>

      {/* Mobile charging context + location */}
      <section className="max-w-md mx-auto px-4 pt-4 pb-4 bg-white border-b border-slate-100 space-y-3">
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-emerald-600 uppercase">Schedule mobile charging</p>
          <h1 className="mt-1 text-base font-semibold text-slate-900">Mobile charger to your location</h1>
          <p className="mt-1 text-[11px] text-slate-500">
            We'll dispatch a mobile charging unit to where your EV is currently parked.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ backgroundColor: '#e6fff7' }}>
            <MapPin className="h-5 w-5" style={{ color: EVZ_COLORS.green }} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">User location</p>
            <p className="text-sm font-semibold text-slate-900">{location}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">This is where the mobile charger will meet your vehicle.</p>
          </div>
          <button
            type="button"
            onClick={() => push('BOOK_MOBILE_LOCATION')}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Change
          </button>
        </div>
      </section>

      {/* Scrollable main content */}
      <main className="max-w-md mx-auto overflow-y-auto pb-24">
        {/* Summary section */}
        <section className="px-4 pt-4 pb-3 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Duration: <span className="font-semibold">{formatDuration(durationMinutes)}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5" />
              <span>{activeTimeZone.label}</span>
            </div>
          </div>

          <div className="mt-1 text-[11px] text-slate-500">
            {selectedStartDateTime ? (
              <p>
                {formatLongDate(selectedStartDateTime)} · {formatTime(selectedStartDateTime)} – {formatTime(selectedEndDateTime)} ({formatDuration(durationMinutes)})
              </p>
            ) : (
              <p>Select a date and time to see your reserved window.</p>
            )}
          </div>
        </section>

        {/* Step 1 – pick a date */}
        {step === 1 && (
          <section className="px-4 pt-4 pb-5 border-b border-slate-100">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Step 1 · Select a date</p>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <p className="text-[11px] font-medium text-slate-500">{formatMonthYear(currentYear, currentMonth)}</p>
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-y-1 text-[10px] font-medium text-slate-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="flex items-center justify-center py-1">
                  {d}
                </div>
              ))}
            </div>

            <MonthGrid monthGrid={monthGrid} today={today} selectedDate={selectedDate} onSelectDate={handleSelectDate} />

            {/* Time zone + duration */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Globe2 className="h-3.5 w-3.5" />
                  <span className="font-medium text-slate-700">Time zone</span>
                </div>
                <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] text-slate-500 border border-slate-200">
                  Auto-adjusts for your current location
                </span>
              </div>

              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                value={timeZoneId}
                onChange={(e) => setTimeZoneId(e.target.value)}
              >
                {TIME_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.label}
                  </option>
                ))}
              </select>

              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Duration: <span className="font-semibold">{formatDuration(durationMinutes)}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDurationPickerOpen((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500 bg-white px-2 py-1 text-[11px] font-medium text-slate-700"
                >
                  <span>Edit</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              {durationPickerOpen && (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 space-y-3">
                  <div className="text-[11px] font-medium text-slate-700">Quick durations</div>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((m) => {
                      const isActive = m === durationMinutes;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setDurationMinutes(m);
                            setDurationPickerOpen(false);
                          }}
                          className={cx(
                            'px-3 py-1.5 rounded-full text-[11px] border transition',
                            isActive
                              ? 'border-emerald-500 text-white'
                              : 'border-slate-200 text-slate-700 bg-slate-50'
                          )}
                          style={
                            isActive
                              ? {
                                  backgroundColor: EVZ_COLORS.green,
                                  borderColor: EVZ_COLORS.green,
                                }
                              : undefined
                          }
                        >
                          {formatDuration(m)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1 border-t border-dashed border-slate-200 mt-2">
                    <p className="text-[11px] font-medium text-slate-700 mb-2">Custom duration</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="block text-slate-500 mb-1">Hours</label>
                        <select
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                          value={customHours}
                          onChange={(e) => setCustomHours(parseInt(e.target.value, 10) || 0)}
                        >
                          {Array.from({ length: 13 }).map((_, index) => (
                            <option key={index} value={index}>
                              {index}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Minutes</label>
                        <select
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(parseInt(e.target.value, 10) || 0)}
                        >
                          {[0, 15, 30, 45].map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={applyCustomDuration}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-[11px] font-semibold text-white shadow-sm"
                      style={{ backgroundColor: EVZ_COLORS.green }}
                    >
                      Apply custom duration
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setStep(2)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              Next: Pick a time
            </button>
          </section>
        )}

        {/* Step 2 – pick time, summary & reminders */}
        {step === 2 && (
          <>
            {/* Step 2 – pick a time */}
            <section className="px-4 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Step 2 · Pick a time</p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-medium text-emerald-600"
                >
                  Change date
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {selectedDate ? formatLongDate(selectedDate) : 'Choose a date first'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">{activeTimeZone.label}</p>

              <div className="mt-3 max-h-64 overflow-y-auto pr-1 space-y-2">
                {ALL_SLOTS.map((slot) => {
                  if (!selectedDate) return null;

                  const slotDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    slot.hour,
                    slot.minute
                  );
                  const isPast = slotDate.getTime() < Date.now();
                  const isSelected = selectedSlotId === slot.id;

                  const slotMinutes = slot.hour * 60 + slot.minute;
                  const disabledBySelection = !!(
                    selectedRange &&
                    selectedSlotId &&
                    slot.id !== selectedSlotId &&
                    slotMinutes > selectedRange.startMinutes &&
                    slotMinutes < selectedRange.endMinutes
                  );

                  const isDisabled = isPast || disabledBySelection;

                  const startLabel = formatTime(slotDate);
                  const endLabel = formatTime(new Date(slotDate.getTime() + durationMinutes * 60000));

                  const buttonStyle = isSelected
                    ? {
                        backgroundColor: EVZ_COLORS.green,
                        borderColor: EVZ_COLORS.green,
                      }
                    : undefined;

                  const chipStyle = isSelected
                    ? {
                        borderColor: EVZ_COLORS.green,
                        color: EVZ_COLORS.green,
                        backgroundColor: 'white',
                      }
                    : {
                        backgroundColor: EVZ_COLORS.green,
                        color: 'white',
                      };

                  const label = isSelected ? 'Selected' : disabledBySelection ? 'Blocked' : 'Confirm';

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectSlot(slot)}
                      className={cx(
                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs transition',
                        isSelected
                          ? 'text-white'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
                        isDisabled && !isSelected && 'opacity-40 cursor-not-allowed'
                      )}
                      style={buttonStyle}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{startLabel}</span>
                        <span className={cx('text-[10px]', isSelected ? 'text-white/90' : 'text-slate-400')}>
                          Ends {endLabel} · {formatDuration(durationMinutes)}
                        </span>
                      </div>
                      <span
                        className={cx('inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium border')}
                        style={chipStyle}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Session summary + confirm button */}
            <section className="px-4 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/5">
                  <Clock className="h-4 w-4 text-slate-900" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Session summary</p>

                  {selectedStartDateTime ? (
                    <div className="mt-1 space-y-0.5 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900">{formatLongDate(selectedStartDateTime)}</p>
                      <p>
                        {formatTime(selectedStartDateTime)} – {formatTime(selectedEndDateTime)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatDuration(durationMinutes)} · {activeTimeZone.label}
                      </p>
                      {conflictMessage && <p className="mt-2 text-[11px] text-red-500">{conflictMessage}</p>}
                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Pick a time to see the start and end of your charging window.
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={!selectedStartDateTime || !!conflictMessage}
                    onClick={handleConfirmSession}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: EVZ_COLORS.orange }}
                  >
                    Confirm charging session
                  </button>
                </div>
              </div>
            </section>

            {/* Reminders section */}
            <section className="px-4 pt-4 pb-5">
              <h2 className="text-sm font-semibold text-slate-900">Reminders</h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Configure SMS and email workflows around the start and end of the charging session.
              </p>

              <div className="mt-3 space-y-3">
                {/* SMS reminder card */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: EVZ_COLORS.green }} />
                    <span>Workflow</span>
                  </div>

                  <div className="mt-2 flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <Bell className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="flex-1 text-[11px] text-slate-600">
                      <p className="text-xs font-semibold text-slate-900">Send text reminder</p>
                      <p className="mt-1">Notify the driver before the charging session begins.</p>

                      <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-slate-500">When</span>
                          <span className="font-semibold text-slate-900">{smsOffsetHours} hours before session starts</span>
                        </div>
                        <select
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                          value={smsOffsetHours}
                          onChange={(e) => setSmsOffsetHours(parseInt(e.target.value, 10))}
                        >
                          {[1, 2, 3, 6, 12, 24].map((h) => (
                            <option key={h} value={h}>
                              {h}h before
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Send SMS to invitee</span>
                        <ToggleSwitch enabled={smsEnabled} onToggle={() => setSmsEnabled((v) => !v)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email follow-up card */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: EVZ_COLORS.orange }} />
                    <span>Workflow</span>
                  </div>

                  <div className="mt-2 flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <Mail className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="flex-1 text-[11px] text-slate-600">
                      <p className="text-xs font-semibold text-slate-900">Send follow-up email</p>
                      <p className="mt-1">Thank the driver, send the receipt and optionally ask for feedback after charging.</p>

                      <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-slate-500">When</span>
                          <span className="font-semibold text-slate-900">{emailOffsetHours} hours after session ends</span>
                        </div>
                        <select
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                          value={emailOffsetHours}
                          onChange={(e) => setEmailOffsetHours(parseInt(e.target.value, 10))}
                        >
                          {[1, 2, 4, 12, 24].map((h) => (
                            <option key={h} value={h}>
                              {h}h after
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Send email to invitee</span>
                        <ToggleSwitch enabled={emailEnabled} onToggle={() => setEmailEnabled((v) => !v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

