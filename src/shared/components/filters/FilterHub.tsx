import React, { useState } from 'react';
import { Filter as FilterIcon, PlugZap, Gauge, Building2, MapPin, Users, Layers, Star, CheckSquare } from 'lucide-react';

function Row({ icon: Icon, title, subtitle, count, onClick }: { icon: any; title: string; subtitle?: string; count?: number | string; onClick?: () => void }): React.ReactElement {
  return (
    <button onClick={onClick} className="w-full p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3 text-left">
        <div className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center text-slate-700"><Icon className="h-4 w-4" /></div>
        <div>
          <div className="text-[13px] font-semibold text-slate-800">{title}</div>
          {subtitle && <div className="text-[11px] text-slate-500">{subtitle}</div>}
        </div>
      </div>
      <div className="text-[11px] text-slate-500">{typeof count === 'number' ? `${count} selected` : count || ''}</div>
    </button>
  );
}

export function FilterHub(): React.ReactElement {
  const [onlyAvail, setOnlyAvail] = useState(true);
  const [fastOnly, setFastOnly] = useState(false);
  const [counts] = useState({ connectors: 2, networks: 3, location: 0, access: 1, rating: 0, devices: 0, category: 1, power: '3–350 kW' });
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setOnlyAvail((v) => !v)} className={`h-11 rounded-xl border text-[13px] ${onlyAvail ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-300 text-slate-700'}`}>
          <CheckSquare className="h-4 w-4 inline mr-2" /> Only show available
        </button>
        <button onClick={() => setFastOnly((v) => !v)} className={`h-11 rounded-xl border text-[13px] ${fastOnly ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-300 text-slate-700'}`}>
          <Gauge className="h-4 w-4 inline mr-2" /> Fast chargers only
        </button>
      </div>
      <Row icon={PlugZap} title="Connector Types" subtitle="CCS2, CHAdeMO, Type2, NACS…" count={counts.connectors} />
      <Row icon={Gauge} title="Power (kW)" subtitle="Min–Max" count={counts.power} />
      <Row icon={Layers} title="Networks" subtitle="EVzone, partners" count={counts.networks} />
      <Row icon={Building2} title="Location Types" subtitle="Mall, On‑street, Parking…" count={counts.location} />
      <Row icon={MapPin} title="Access" subtitle="24/7, Public, No restrictions, Taxi only" count={counts.access} />
      <Row icon={Star} title="User Rating" subtitle="≥2★, ≥3★, ≥4★" count={counts.rating} />
      <Row icon={Users} title="Multiple Devices" subtitle="Min. stalls at site" count={counts.devices} />
      <Row icon={FilterIcon} title="Station Category" subtitle="Public / Corporate / Residential" count={counts.category} />
    </div>
  );
}

