import React, { useState } from 'react';
import { Bell, CreditCard, CalendarClock } from 'lucide-react';

function ToggleRow({ icon: Icon, title, subtitle, value, onChange }: { icon: any; title: string; subtitle: string; value: boolean; onChange: (v: boolean) => void }): React.ReactElement {
  return (
    <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3">
      <div>
        <div className="text-[13px] font-semibold text-slate-800 inline-flex items-center gap-2"><Icon className="h-4 w-4" /> {title}</div>
        <div className="text-[11px] text-slate-500">{subtitle}</div>
      </div>
      <label className="inline-flex items-center gap-2 text-[12px]">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      </label>
    </div>
  );
}

export function NotificationSettings(): React.ReactElement {
  const [booking, setBooking] = useState(true);
  const [payments, setPayments] = useState(true);
  return (
    <div className="grid gap-3">
      <ToggleRow icon={CalendarClock} title="Bookings" subtitle="Reminders and updates" value={booking} onChange={setBooking} />
      <ToggleRow icon={CreditCard} title="Payment & receipts" subtitle="Payment results and receipts" value={payments} onChange={setPayments} />
    </div>
  );
}

