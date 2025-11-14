/**
 * Test Notification Screen
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

function canNotify(): boolean {
  return 'Notification' in window;
}

async function requestPermission(): Promise<NotificationPermission> {
  if (!canNotify()) return 'denied';
  if (Notification.permission === 'default') {
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }
  return Notification.permission;
}

export function TestNotificationScreen(): React.ReactElement {
  const { back } = useNavigation();
  const [status, setStatus] = useState<NotificationPermission>(canNotify() ? Notification.permission : 'denied');

  useEffect(() => {
    setStatus(canNotify() ? Notification.permission : 'denied');
  }, []);

  async function handleSend(): Promise<void> {
    const perm = await requestPermission();
    setStatus(perm);
    if (perm !== 'granted') {
      alert('Please enable notifications in your browser settings.');
      return;
    }
    try {
      const n = new Notification('EVzone — Test Notification', {
        body: 'This is a sample notification to verify settings.',
        tag: 'evz-test',
      });
      setTimeout(() => n.close(), 4000);
    } catch (e) {
      alert('Browser blocked notifications.');
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Test Notification</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800">Status</div>
          <div className="mt-1 text-[13px] text-slate-700">{canNotify() ? `Browser permission: ${status}` : 'Notifications are not supported in this browser.'}</div>

          <div className="mt-4 text-[12px] text-slate-600 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" />
            <span>Make sure notifications are allowed for this site in your browser settings.</span>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSend}
              className="h-11 w-full rounded-xl text-white font-medium inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              <Bell className="h-4 w-4" /> Send Test Notification
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

