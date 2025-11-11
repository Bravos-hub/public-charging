/**
 * Profile Screen (TypeScript)
 */

import React from 'react';
import { Settings, Bell, History as HistoryIcon, Home } from 'lucide-react';
import { useNavigation } from '../../core';

export function ProfileScreen(): React.ReactElement {
  const { push } = useNavigation();

  return (
    <div className="w-full p-4 grid gap-3">
      <button
        onClick={() => push('PROFILE_SETTINGS')}
        className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3 hover:bg-slate-50 transition-colors"
      >
        <Settings className="h-4 w-4" /> Profile & Settings
      </button>
      <button
        onClick={() => push('PROFILE_NOTIFICATIONS')}
        className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3 hover:bg-slate-50 transition-colors"
      >
        <Bell className="h-4 w-4" /> Notification Settings
      </button>
      <button
        onClick={() => push('ACTIVITY')}
        className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3 hover:bg-slate-50 transition-colors"
      >
        <HistoryIcon className="h-4 w-4" /> History
      </button>
      <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 px-3 hover:bg-slate-50 transition-colors">
        <Home className="h-4 w-4" /> Add to Home
      </button>
    </div>
  );
}

