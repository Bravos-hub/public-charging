import React from 'react';
import { RefreshCcw, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';

interface UpdatePromptProps {
  visible: boolean;
  currentVersion?: string;
  latestVersion?: string;
  notes?: string[];
  onLater?: () => void;
  onRefresh?: () => void;
}

export function UpdatePrompt({
  visible,
  currentVersion = 'v1.0.0',
  latestVersion = 'latest',
  notes = [
    'Improved performance and bug fixes.',
  ],
  onLater,
  onRefresh,
}: UpdatePromptProps): React.ReactElement | null {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-md mx-auto p-4">
          <div className="rounded-2xl bg-white shadow-xl border border-slate-200 p-4">
            <div className="text-[14px] font-semibold text-slate-900">New version available</div>
            <div className="text-[12px] text-slate-600 mt-1">Update for the best performance and latest features.</div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <div className="text-slate-600">Current</div>
              <div className="text-right font-semibold">{currentVersion}</div>
              <div className="text-slate-600">Latest</div>
              <div className="text-right font-semibold">{latestVersion}</div>
            </div>

            <div className="mt-3">
              <div className="text-[12px] font-semibold text-slate-800 mb-1">What’s new</div>
              <ul className="list-disc pl-5 text-[12px] text-slate-700 space-y-1">
                {notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={onLater}
                className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
              >
                Later
              </button>
              <button
                onClick={onRefresh}
                className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: EVZ_COLORS.orange }}
              >
                <RefreshCcw className="h-4 w-4" /> Refresh Now
              </button>
            </div>

            <div className="mt-3 text-[11px] text-slate-600 inline-flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5" />
              <span>Updates may reload cached assets (PWA). Your data remains safe.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

