import React from 'react';

export function NetworkBadges({ networks = ['EVzone', 'Partner A', 'Partner B'] }: { networks?: string[] }): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {networks.map((n) => (
        <span key={n} className="px-2 py-0.5 rounded-full text-[11px] border border-slate-200 bg-slate-50 text-slate-700">{n}</span>
      ))}
    </div>
  );
}

