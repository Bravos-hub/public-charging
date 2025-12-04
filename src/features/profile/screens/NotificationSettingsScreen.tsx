/**
 * Notification Settings Screen
 * Toggles for categories and quiet hours as per mock.
 */

import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CalendarClock, Plug, CreditCard, Megaphone, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useApp, useNavigation } from '../../../core';

function Row({ icon: Icon, title, subtitle, value, onChange, disabled = false }: { icon: any; title: string; subtitle: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }): React.ReactElement {
  return (
    <div className={`p-3 rounded-2xl border ${disabled ? 'border-slate-200 bg-slate-50 opacity-60' : 'border-slate-200 bg-white'} flex items-center justify-between`}>
      <div>
        <div className="text-[13px] font-semibold text-slate-800 inline-flex items-center gap-2">
          <Icon className="h-4 w-4" /> {title}
        </div>
        <div className="text-[11px] text-slate-500">{subtitle}</div>
      </div>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      </label>
    </div>
  );
}

export function NotificationSettingsScreen(): React.ReactElement {
  const { notifications, setNotifications } = useApp();
  const { back, push } = useNavigation();
  const [state, setState] = useState(notifications);

  function save(): void {
    setNotifications(state);
    back();
  }

  const disabled = !state.enabled;

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Notification Settings</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-28">
        <div className="grid gap-3">
          <Row icon={ShieldCheck} title="Enable notifications" subtitle="Allow EVzone to send you alerts" value={state.enabled} onChange={(v) => setState((s) => ({ ...s, enabled: v }))} disabled={false} />
          <Row icon={CalendarClock} title="Booking updates" subtitle="Confirmations, reminders, changes" value={state.booking} onChange={(v) => setState((s) => ({ ...s, booking: v }))} disabled={disabled} />
          <Row icon={Plug} title="Charging status" subtitle="Start/stop, milestones, issues" value={state.charging} onChange={(v) => setState((s) => ({ ...s, charging: v }))} disabled={disabled} />
          <Row icon={CreditCard} title="Payment & receipts" subtitle="Payment results and receipts" value={state.payments} onChange={(v) => setState((s) => ({ ...s, payments: v }))} disabled={disabled} />
          <Row icon={Megaphone} title="Promotions" subtitle="Discounts and news" value={state.promotions} onChange={(v) => setState((s) => ({ ...s, promotions: v }))} disabled={disabled} />
        </div>

        {/* Quiet hours */}
        <div className="mt-5 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800">Quiet hours</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] text-slate-600 mb-1">Start</div>
              <input type="time" value={state.quietStart} onChange={(e) => setState((s) => ({ ...s, quietStart: e.target.value }))} className="h-10 w-full rounded-xl border border-slate-300 text-[13px] px-3" disabled={disabled} />
            </div>
            <div>
              <div className="text-[11px] text-slate-600 mb-1">End</div>
              <input type="time" value={state.quietEnd} onChange={(e) => setState((s) => ({ ...s, quietEnd: e.target.value }))} className="h-10 w-full rounded-xl border border-slate-300 text-[13px] px-3" disabled={disabled} />
            </div>
          </div>
          <div className="mt-3 text-[12px] text-slate-600 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" /> Critical alerts (e.g., charging stopped unexpectedly) may still arrive during quiet hours.
          </div>
        </div>

        {/* Test Notification */}
        <div className="mt-5">
          <button
            onClick={() => push('PROFILE_TEST_NOTIFICATION')}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white text-slate-700"
          >
            Send Test Notification
          </button>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={back} className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Cancel</button>
          <button onClick={save} className="h-11 rounded-xl text-white font-medium" style={{ backgroundColor: EVZ_COLORS.orange }}>Save</button>
        </div>
      </main>
    </div>
  );
}
