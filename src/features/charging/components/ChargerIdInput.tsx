import React, { useState } from 'react';
import { Keyboard } from 'lucide-react';

export function ChargerIdInput({ onSubmit }: { onSubmit?: (id: string) => void }): React.ReactElement {
  const [id, setId] = useState('');
  function submit(): void { onSubmit?.(id.trim()); }
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[12px] text-slate-600">Enter Charger ID</div>
      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. EVZ-1234"
          className="h-11 px-3 rounded-xl border border-slate-300 text-[13px]"
        />
        <button onClick={submit} className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2">
          <Keyboard className="h-4 w-4" /> Submit
        </button>
      </div>
    </div>
  );
}

