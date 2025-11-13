/**
 * Booking Time Picker Component (TypeScript)
 */

import React, { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

interface Day {
  key: number;
  label: string;
  date: Date;
}

interface TimeSlot {
  t: string;
  state: 'available' | 'occupied' | 'suggested';
}

function fmt(n: number): string {
  return n.toString().padStart(2, '0');
}

function timeLabel(h: number, m: number): string {
  return `${fmt(h)}:${fmt(m)}`;
}

function makeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let h = 8; h <= 21; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 21 && m > 45) break;
      slots.push({ t: timeLabel(h, m), state: 'available' });
    }
  }
  const occupied = new Set(['10:00', '10:15', '10:30', '14:45', '18:00']);
  const suggested = '16:30';
  return slots.map((s) => ({
    ...s,
    state: occupied.has(s.t) ? 'occupied' : s.t === suggested ? 'suggested' : 'available',
  }));
}

interface DayChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function DayChip({ label, active, onClick }: DayChipProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-3 rounded-xl text-[12px] border ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

interface TimePickerProps {
  stationName?: string;
  mode?: 'fixed' | 'mobile';
  onModeChange?: (mode: 'fixed' | 'mobile') => void;
  onTimeSelect?: (time: string, date: Date) => void;
  onBack?: () => void;
}

export function TimePicker({
  stationName = 'Central Hub',
  mode: initialMode = 'fixed',
  onModeChange,
  onTimeSelect,
  onBack,
}: TimePickerProps): React.ReactElement {
  const { route, push } = useNavigation();
  const [mode, setMode] = useState<'fixed' | 'mobile'>(initialMode);
  const [dateIndex, setDateIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerHour, setPickerHour] = useState(9);
  const [pickerMin, setPickerMin] = useState(0);

  const days = useMemo<Day[]>(() => {
    const arr: Day[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      arr.push({
        key: i,
        label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        date: d,
      });
    }
    return arr;
  }, []);

  const slots = useMemo(() => makeSlots(), [dateIndex]);

  function toggleSelect(t: string, state: string): void {
    if (state !== 'available' && state !== 'suggested') return;
    const newSelected = t === selected ? null : t;
    setSelected(newSelected);
    if (newSelected) {
      onTimeSelect?.(newSelected, days[dateIndex].date);
    }
  }

  function adoptPicker(): void {
    const t = `${fmt(pickerHour)}:${fmt(pickerMin)}`;
    setSelected(t);
    setPickerOpen(false);
    onTimeSelect?.(t, days[dateIndex].date);
  }

  function handleModeChange(newMode: 'fixed' | 'mobile'): void {
    if (newMode === 'mobile') {
      // Navigate to mobile charging location screen, preserving station info
      push('BOOK_MOBILE_LOCATION', {
        station: route.params?.station,
        stationId: route.params?.stationId,
        stationName: route.params?.stationName || stationName,
      });
      return;
    }
    setMode(newMode);
    onModeChange?.(newMode);
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button className="inline-flex items-center gap-2" aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold truncate">Reserve — {stationName}</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-28">
        {/* Mode toggle */}
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-[12px]">
          <button
            className={`h-9 rounded-lg ${mode === 'fixed' ? 'bg-white shadow font-semibold' : 'text-slate-600'}`}
            onClick={() => handleModeChange('fixed')}
          >
            Fixed Station
          </button>
          <button
            className={`h-9 rounded-lg ${mode !== 'fixed' ? 'bg-white shadow font-semibold' : 'text-slate-600'}`}
            onClick={() => handleModeChange('mobile')}
          >
            Mobile Charging
          </button>
        </div>

        {/* Date strip */}
        <div className="mt-4 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((d, i) => (
            <DayChip
              key={d.key}
              label={d.label}
              active={i === dateIndex}
              onClick={() => setDateIndex(i)}
            />
          ))}
        </div>

        {/* Time picker open */}
        <div className="mt-4 flex items-center gap-2 text-[12px]">
          <Calendar className="h-4 w-4 text-slate-600" />
          <span className="text-slate-700">Select a start time from the slots below or</span>
          <button onClick={() => setPickerOpen(true)} className="underline text-slate-900">
            open picker
          </button>
        </div>

        {/* Slots grid */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {slots.map((s) => {
            const isSel = selected === s.t;
            const base = 'h-9 rounded-lg text-[12px] border';
            const style =
              s.state === 'occupied'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : isSel
                ? 'bg-emerald-600 text-white border-emerald-700'
                : s.state === 'suggested'
                ? 'bg-white text-violet-700 border-violet-300 ring-1 ring-violet-300'
                : 'bg-white text-slate-700 border-slate-200';
            return (
              <button
                key={s.t}
                onClick={() => toggleSelect(s.t, s.state)}
                disabled={s.state === 'occupied'}
                className={`${base} ${style}`}
              >
                {s.t}
              </button>
            );
          })}
        </div>

        {/* Selection summary + CTA */}
        <div className="mt-5 p-3 rounded-xl border border-slate-200 bg-slate-50 text-[12px]">
          <div>
            <span className="font-medium">Selected:</span> {selected || 'None'}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelected(null)}
              className="h-10 rounded-lg border border-slate-300 bg-white text-slate-700"
            >
              Clear
            </button>
            <button
              disabled={!selected}
              className="h-10 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              Continue
            </button>
          </div>
        </div>
      </main>

      {/* Time Picker Overlay */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPickerOpen(false)} />
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-md mx-auto p-4">
              <div className="rounded-2xl bg-white shadow-xl border border-slate-200 p-4">
                <div className="text-sm font-semibold text-slate-800">Pick a start time</div>
                <div className="mt-3 flex items-center gap-3">
                  <select
                    className="h-10 px-2 rounded-lg border border-slate-300"
                    value={pickerHour}
                    onChange={(e) => setPickerHour(parseInt(e.target.value, 10))}
                  >
                    {Array.from({ length: 14 }).map((_, i) => {
                      const h = 8 + i;
                      return (
                        <option key={h} value={h}>
                          {fmt(h)}
                        </option>
                      );
                    })}
                  </select>
                  <span className="text-slate-500">:</span>
                  <select
                    className="h-10 px-2 rounded-lg border border-slate-300"
                    value={pickerMin}
                    onChange={(e) => setPickerMin(parseInt(e.target.value, 10))}
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {fmt(m)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPickerOpen(false)}
                    className="h-10 rounded-lg border border-slate-300 bg-white text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={adoptPicker}
                    className="h-10 rounded-lg text-white font-medium"
                    style={{ backgroundColor: EVZ_COLORS.orange }}
                  >
                    Use Time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePicker;

