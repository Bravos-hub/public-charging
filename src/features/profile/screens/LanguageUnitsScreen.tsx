/**
 * Language & Units Screen (TypeScript)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Globe2, Info } from 'lucide-react';
import { useNavigation } from '../../../core';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { setLang, getCurrentLang } from '../../../core/utils/i18n';

type DistanceUnit = 'km' | 'mi';
type Currency = 'UGX' | 'KES' | 'TZS' | 'USD';

interface Prefs {
  lang: 'en' | 'fr' | 'sw';
  distance: DistanceUnit;
  currency: Currency;
}

const STORAGE_KEY = 'evz.prefs';

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Prefs;
  } catch {}
  return { lang: (getCurrentLang?.() as any) || 'en', distance: 'km', currency: 'UGX' };
}

export function LanguageUnitsScreen(): React.ReactElement {
  const { back } = useNavigation();
  const [lang, setLanguage] = useState<Prefs['lang']>('en');
  const [distance, setDistance] = useState<DistanceUnit>('km');
  const [currency, setCurrency] = useState<Currency>('UGX');

  useEffect(() => {
    const p = loadPrefs();
    setLanguage(p.lang);
    setDistance(p.distance);
    setCurrency(p.currency);
  }, []);

  const preview = useMemo(() => {
    const dist = distance === 'km' ? '12.4 km' : '7.7 mi';
    const price = `${currency} 123,457`;
    return { dist, price };
  }, [distance, currency]);

  function handleCancel(): void {
    back();
  }

  function handleSave(): void {
    // persist
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, distance, currency }));
    } catch {}
    // apply language immediately
    try {
      setLang(lang);
    } catch {}
    back();
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center gap-2">
            <Globe2 className="h-5 w-5" />
            <span className="font-semibold">Language & Units</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-28">
        {/* Language */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white mb-4">
          <div className="text-sm font-semibold text-slate-800">Language</div>
          <div className="mt-2">
            <select
              className="w-full h-11 px-3 rounded-xl border border-slate-300 text-[13px]"
              value={lang}
              onChange={(e) => setLanguage(e.target.value as Prefs['lang'])}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>

        {/* Units */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white mb-4">
          <div className="text-sm font-semibold text-slate-800">Units</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[12px] text-slate-600 mb-1">Distance</div>
              <select
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-[13px]"
                value={distance}
                onChange={(e) => setDistance(e.target.value as DistanceUnit)}
              >
                <option value="km">Kilometres (km)</option>
                <option value="mi">Miles (mi)</option>
              </select>
            </div>
            <div>
              <div className="text-[12px] text-slate-600 mb-1">Currency</div>
              <select
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-[13px]"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
              >
                <option value="UGX">UGX</option>
                <option value="KES">KES</option>
                <option value="TZS">TZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-600 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" />
            <span>Energy is shown in kWh and power in kW.</span>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800">Preview</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
            <div className="text-slate-600">Distance</div>
            <div className="text-right font-medium">{preview.dist}</div>
            <div className="text-slate-600">Price</div>
            <div className="text-right font-medium">{preview.price}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleCancel}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}

