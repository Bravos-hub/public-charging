/**
 * System Offline Screen (TypeScript)
 * Uses the extracted Batch 13 design with our shared Offline component
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { Offline } from '../../shared/components/errors/Offline';

export function SystemOfflineScreen(): React.ReactElement {
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center text-white">
          <WifiOff className="h-5 w-5" />
          <span className="ml-2 font-semibold">Offline</span>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        <Offline />
      </main>
    </div>
  );
}

