import React, { useMemo } from 'react';
import { Clock3, MapPin } from 'lucide-react';

export function ETATracking({
  from = 'Current location',
  to = 'Station',
  minutes = 12,
}: {
  from?: string;
  to?: string;
  minutes?: number;
}): React.ReactElement {
  const arrival = useMemo(() => {
    const d = new Date(Date.now() + minutes * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [minutes]);

  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[12px] text-slate-600">ETA</div>
      <div className="mt-1 text-[13px] font-semibold inline-flex items-center gap-2">
        <MapPin className="h-4 w-4" /> {from} → {to}
      </div>
      <div className="mt-2 inline-flex items-center gap-2 text-[12px] text-slate-700">
        <Clock3 className="h-4 w-4" /> {minutes} min • Arrive ~{arrival}
      </div>
    </div>
  );
}

