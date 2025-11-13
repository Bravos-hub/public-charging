import React, { useState } from 'react';
import { Star, Image as ImageIcon, Info } from 'lucide-react';

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} aria-label={`${n} star`} className="group">
          <Star className={`h-7 w-7 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
        </button>
      ))}
    </div>
  );
}

export function RateStation(): React.ReactElement {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  function submit(): void { if (rating > 0) setAdded(true); }
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[12px] text-slate-600">Your rating</div>
      <div className="mt-2"><Stars value={rating} onChange={setRating} /></div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-800">Comments (optional)</div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Share a quick tip for other drivers…" className="mt-2 w-full h-28 p-3 rounded-xl border border-slate-300 text-[13px]" />
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-800">Photos (optional)</div>
        <div className="mt-2 p-3 rounded-xl border border-slate-300 bg-slate-50 text-[12px] text-slate-600 inline-flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> Tap to attach (stub)
        </div>
        <div className="mt-2 text-[12px] text-slate-600 flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> Don’t upload faces or personal info.</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Cancel</button>
        <button disabled={rating <= 0} onClick={submit} className="h-11 rounded-xl text-white font-medium disabled:opacity-50" style={{ backgroundColor: '#f77f00' }}>Submit Rating</button>
      </div>
      {added && <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-[12px]">Thanks for the feedback!</div>}
    </div>
  );
}

