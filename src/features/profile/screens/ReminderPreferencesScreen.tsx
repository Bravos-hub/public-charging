/**
 * Reminder Preferences Screen
 * Allows selecting pre-start reminders, countdown notifications, and grace warnings.
 */

import React, { useMemo, useState } from 'react';
import { ArrowLeft, AlarmClock, Clock, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useApp, useNavigation } from '../../../core';

function MinuteChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-3 rounded-xl border text-[13px] ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}
    >
      {label}
    </button>
  );
}

export function ReminderPreferencesScreen(): React.ReactElement {
  const { reminderPrefs, setReminderPrefs } = useApp();
  const { back } = useNavigation();
  const [state, setState] = useState(reminderPrefs);

  const options = [5, 15, 30, 60];
  const selectedLabel = useMemo(() => state.beforeStartMinutes.sort((a, b) => a - b).join(', '), [state.beforeStartMinutes]);

  function toggleMinute(min: number): void {
    setState((s) => {
      const has = s.beforeStartMinutes.includes(min);
      return {
        ...s,
        beforeStartMinutes: has ? s.beforeStartMinutes.filter((m) => m !== min) : [...s.beforeStartMinutes, min],
      };
    });
  }

  function save(): void {
    setReminderPrefs(state);
    back();
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center gap-2">
            <AlarmClock className="h-5 w-5" />
            <span className="font-semibold">Reminder Preferences</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-28 grid gap-4">
        {/* Before booking start */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-[12px] text-slate-600 mb-2">Before booking start</div>
          <div className="grid grid-cols-4 gap-2">
            {options.map((m) => (
              <MinuteChip key={m} label={`${m} min`} active={state.beforeStartMinutes.includes(m)} onClick={() => toggleMinute(m)} />
            ))}
          </div>
          <div className="mt-2 text-[12px] text-slate-600">Selected: {selectedLabel ? `${selectedLabel} min` : '—'}</div>
        </div>

        {/* Countdown notifications */}
        <div className="p-3 rounded-2xl border border-slate-200 bg-white inline-flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-800">
            <Clock className="h-4 w-4" /> Show countdown notifications
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={state.showCountdown} onChange={(e) => setState((s) => ({ ...s, showCountdown: e.target.checked }))} />
          </label>
        </div>

        {/* Grace period warning */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-800">
            <input type="checkbox" className="mr-1" checked={state.graceWarning} onChange={(e) => setState((s) => ({ ...s, graceWarning: e.target.checked }))} />
            Grace period warning
          </div>
          <div className="mt-3 text-[12px] text-slate-600">Warn me</div>
          <select
            value={state.graceWarnMinutes}
            onChange={(e) => setState((s) => ({ ...s, graceWarnMinutes: parseInt(e.target.value, 10) }))}
            className="mt-1 h-10 w-full rounded-xl border border-slate-300 text-[13px] px-3"
            disabled={!state.graceWarning}
          >
            {[3, 5, 10, 15].map((m) => (
              <option key={m} value={m}>{m} min before end</option>
            ))}
          </select>
          <div className="mt-3 text-[12px] text-slate-600 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" /> Applies to both booking windows and active charging grace periods.
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button onClick={back} className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Cancel</button>
          <button onClick={save} className="h-11 rounded-xl text-white font-medium" style={{ backgroundColor: EVZ_COLORS.orange }}>Save</button>
        </div>
      </main>
    </div>
  );
}

