import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export function ReminderPreferences(): React.ReactElement {
  const [reminders, setReminders] = useState(true);
  const [idle, setIdle] = useState(true);
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-3 text-[13px]">
      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} /> Booking reminders</label>
      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={idle} onChange={(e) => setIdle(e.target.checked)} /> Idle fee warnings</label>
    </div>
  );
}

