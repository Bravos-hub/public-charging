/**
 * EVzone Preview / Project Settings (TypeScript)
 * Utility screen to preview environment, version, PWA status and quick links.
 */

import React, { useMemo } from 'react';
import { ArrowLeft, RefreshCw, Zap, Globe2, Shield } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import { useApp } from '../../../core';
import pkg from '../../../../package.json';

export function ProjectSettingsPreviewScreen(): React.ReactElement {
  const { back, push } = useNavigation();
  const { drPeak, setDrPeak } = useApp();

  const meta = useMemo(() => {
    const currentVersion = (process.env.REACT_APP_APP_VERSION as string) || (pkg as any).version || 'v0.0.0';
    const sw = 'serviceWorker' in navigator;
    const swActive = !!(navigator as any).serviceWorker?.controller;
    return {
      currentVersion,
      userAgent: navigator.userAgent,
      platform: (navigator as any).platform || 'web',
      sw,
      swActive,
    };
  }, []);

  async function clearCachesAndSW(): Promise<void> {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      window.location.reload();
    } catch {
      window.location.reload();
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
          <span className="font-semibold">EVzone Preview</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24 grid gap-4">
        {/* Version / Env */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 mb-2">Environment</div>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="text-slate-600">Version</div><div className="text-right font-medium">{meta.currentVersion}</div>
            <div className="text-slate-600">Platform</div><div className="text-right font-medium">{meta.platform}</div>
            <div className="text-slate-600">Browser</div><div className="text-right font-medium truncate" title={meta.userAgent}>{meta.userAgent}</div>
            <div className="text-slate-600">PWA / SW</div><div className="text-right font-medium">{meta.sw ? (meta.swActive ? 'Active' : 'Registered') : 'N/A'}</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => window.location.reload()}
              className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Reload App
            </button>
            <button
              onClick={() => push('PRICING_TARIFFS')}
              className="h-10 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              <Shield className="h-4 w-4" /> Pricing & Tariffs
            </button>
          </div>
        </div>

        {/* DR Peak toggle */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 mb-2">Demand Response</div>
          <div className="text-[12px] text-slate-600">Toggle DR banner (Discover).</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setDrPeak((s) => ({ ...s, active: !s.active }))}
              className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" /> {drPeak.active ? 'Disable DR' : 'Enable DR'}
            </button>
            <button
              onClick={() => push('PROFILE_TEST_NOTIFICATION')}
              className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
            >
              <Globe2 className="h-4 w-4" /> Test Notification
            </button>
          </div>
        </div>

        {/* SDK / Device info links (stubs) */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 mb-2">Tools</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={clearCachesAndSW}
              className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700"
            >
              Clear Cache & SW
            </button>
            <button
              onClick={() => push('CONTACT_SUPPORT')}
              className="h-10 rounded-xl text-white font-medium"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              Contact/Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
