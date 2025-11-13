/**
 * Offline Cache Screen (TypeScript)
 * Full-screen wrapper for offline cache management
 */

import React, { useState } from 'react';
import { ArrowLeft, WifiOff, Download, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation } from '../../core';

export function OfflineCacheScreen(): React.ReactElement {
  const { back } = useNavigation();
  const [cached, setCached] = useState(false);
  const [updating, setUpdating] = useState(false);
  const size = '12.4 MB';
  const lastUpdated = cached ? 'Just now' : '—';

  function handleCacheNow(): void {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setCached(true);
    }, 1000);
  }

  function handleManageStorage(): void {
    // In a real app, this would open storage management
    console.log('Manage storage');
    alert('Storage management coming soon!');
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <WifiOff className="h-5 w-5" />
            <span className="font-semibold">Offline Cache</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* First information card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-sm font-semibold text-slate-800 mb-2">Work reliably when you're offline</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            We'll cache key UI assets and your latest favorites so you can still open EVzone without a connection.
          </div>
        </div>

        {/* Second information card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-600">Estimated size</span>
            <span className="text-xs font-medium text-slate-900">{size}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-600">Last updated</span>
            <span className="text-xs font-medium text-slate-900">{lastUpdated}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleCacheNow}
            disabled={updating}
            className="h-11 rounded-xl bg-orange-500 text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>{updating ? 'Updating…' : cached ? 'Update cache' : 'Cache now'}</span>
          </button>
          <button
            onClick={handleManageStorage}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Manage storage
          </button>
        </div>

        {/* Informational note */}
        <div className="text-xs text-slate-600 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>On first install, your browser may automatically cache assets as part of the PWA.</span>
        </div>
      </main>
    </div>
  );
}

