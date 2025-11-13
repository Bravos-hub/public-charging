/**
 * Report a Problem Screen
 * Wraps the ReportProblem component with a green header.
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import { ReportProblem } from '../components/ReportProblem';

export function ReportProblemScreen(): React.ReactElement {
  const { back } = useNavigation();
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Report a Problem</span>
          <div className="w-5" />
        </div>
      </div>
      <main className="max-w-md mx-auto px-4 py-4 pb-28">
        <ReportProblem />
      </main>
    </div>
  );
}

