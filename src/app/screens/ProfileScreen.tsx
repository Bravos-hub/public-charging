/**
 * Profile Screen (TypeScript)
 */

import React from 'react';
import { Settings, Bell, History as HistoryIcon, Home } from 'lucide-react';

export function ProfileScreen(): React.ReactElement {
  return (
    <div className="h-full p-4 max-w-md mx-auto grid gap-3">
      <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3">
        <Settings className="h-4 w-4" /> Profile & Settings
      </button>
      <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3">
        <Bell className="h-4 w-4" /> Notification Settings
      </button>
      <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3">
        <HistoryIcon className="h-4 w-4" /> History
      </button>
      <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3">
        <Home className="h-4 w-4" /> Add to Home
      </button>
    </div>
  );
}

