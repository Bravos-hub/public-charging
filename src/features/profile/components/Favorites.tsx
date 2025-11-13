import React from 'react';
import { Bookmark } from 'lucide-react';

export function Favorites(): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white text-[13px] text-slate-700">
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><Bookmark className="h-4 w-4" /> Favorites</div>
      <div className="mt-2">Your saved stations will appear here.</div>
    </div>
  );
}

