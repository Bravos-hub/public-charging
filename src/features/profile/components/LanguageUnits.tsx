import React, { useState } from 'react';

export function LanguageUnits(): React.ReactElement {
  const [lang, setLang] = useState<'en' | 'fr' | 'sw'>('en');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-3 text-[13px]">
      <div>
        <div className="text-[12px] text-slate-600">Language</div>
        <select className="mt-1 h-10 px-3 rounded-xl border border-slate-300" value={lang} onChange={(e) => setLang(e.target.value as any)}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>
      <div>
        <div className="text-[12px] text-slate-600">Units</div>
        <select className="mt-1 h-10 px-3 rounded-xl border border-slate-300" value={units} onChange={(e) => setUnits(e.target.value as any)}>
          <option value="metric">Metric (kW, km)</option>
          <option value="imperial">Imperial (kW, mi)</option>
        </select>
      </div>
    </div>
  );
}

