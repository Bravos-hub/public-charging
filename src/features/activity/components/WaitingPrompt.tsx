import React from 'react';
import { Clock3, Info } from 'lucide-react';

export function WaitingPrompt({
  title = 'Please wait',
  message = 'We are preparing your session. This may take a few moments.',
}: {
  title?: string;
  message?: string;
}): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-start gap-2">
        <Clock3 className="h-5 w-5 text-slate-600" />
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          <div className="text-[12px] text-slate-600 mt-0.5 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" /> {message}
          </div>
        </div>
      </div>
    </div>
  );
}

