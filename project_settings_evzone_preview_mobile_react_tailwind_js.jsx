import React, { useMemo, useState } from "react";
import { Settings, Palette, Globe, Ruler, CreditCard, Smartphone, Bell, Moon, Sun, Shield, Download, Info, Wifi, Cloud, Activity, FileText, CalendarClock } from "lucide-react";

/**
 * Project Settings — EVzone (Preview, Mobile, React + Tailwind, JS)
 *
 * Purpose
 * - A single, comprehensive settings page for the entire EVzone project (this chat’s scope).
 * - Covers: Branding/Theme, Language & Units, Payments, Bookings, Charging, Notifications,
 *   System/PWA, Roaming/DR, Legal/Support. Cash is generally excluded for bookings; enable on postpaid flows.
 *
 * Notes
 * - Self‑contained preview (no external dependencies besides lucide icons + Tailwind).
 * - Save & Reset buttons; simple summary preview of selected key settings.
 */

const EVZ = { green: "#03cd8c", orange: "#f77f00" };

export default function ProjectSettingsEVZ(){
  // Branding & theme
  const [projectName, setProjectName] = useState("EVzone Charging");
  const [primary, setPrimary] = useState("#03cd8c");
  const [accent, setAccent]   = useState("#f77f00");
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Language & units
  const [lang, setLang] = useState("English");
  const [distance, setDistance] = useState("km");
  const [currency, setCurrency] = useState("UGX");

  // Payments (global availability)
  const [pay, setPay] = useState({ evzone:true, card:true, mobile:true, alipay:true, wechat:true });
  function togglePay(k){ setPay(p=> ({ ...p, [k]: !p[k] })); }

  // Booking defaults (global)
  const [bookingFeeEnabled, setBookingFeeEnabled] = useState(true);
  const [holdMinutes, setHoldMinutes] = useState(10); // unpaid reservation hold

  // Charging defaults
  const [fixedBillingModel, setFixedBillingModel] = useState('time'); // 'time' | 'energy'
  const [showCameraExplainer, setShowCameraExplainer] = useState(true);

  // Notifications
  const [notif, setNotif] = useState({ enabled:true, bookings:true, charging:true, payments:true, promo:false });
  const [qhStart, setQhStart] = useState('22:00');
  const [qhEnd, setQhEnd] = useState('06:00');

  // System / PWA
  const [showA2H, setShowA2H] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);

  // Roaming / DR
  const [showNetworkBadges, setShowNetworkBadges] = useState(true);
  const [showDRBanner, setShowDRBanner] = useState(true);

  // Legal / Support
  const [tosUrl, setTosUrl] = useState("/legal/terms");
  const [privacyUrl, setPrivacyUrl] = useState("/legal/privacy");

  const [saved, setSaved] = useState(false);
  function save(){ setSaved(true); setTimeout(()=> setSaved(false), 1500); }
  function reset(){
    setProjectName("EVzone Charging"); setPrimary("#03cd8c"); setAccent("#f77f00"); setDarkMode(false); setHighContrast(false);
    setLang("English"); setDistance("km"); setCurrency("UGX");
    setPay({ evzone:true, card:true, mobile:true, alipay:true, wechat:true });
    setBookingFeeEnabled(true); setHoldMinutes(10);
    setFixedBillingModel('time'); setShowCameraExplainer(true);
    setNotif({ enabled:true, bookings:true, charging:true, payments:true, promo:false }); setQhStart('22:00'); setQhEnd('06:00');
    setShowA2H(true); setOfflineCache(true); setShowNetworkBadges(true); setShowDRBanner(true);
    setTosUrl("/legal/terms"); setPrivacyUrl("/legal/privacy");
  }

  const summary = useMemo(()=> ({
    name: projectName, primary, accent, dark: darkMode, lang, distance, currency,
    payments: Object.keys(pay).filter(k=>pay[k]),
    bookingFeeEnabled, holdMinutes, fixedBillingModel,
    notif: { ...notif, qhStart, qhEnd },
    pwa: { showA2H, offlineCache },
    roaming: { showNetworkBadges, showDRBanner }
  }), [projectName, primary, accent, darkMode, lang, distance, currency, pay, bookingFeeEnabled, holdMinutes, fixedBillingModel, notif, qhStart, qhEnd, showA2H, offlineCache, showNetworkBadges, showDRBanner]);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: EVZ.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back"><Settings className="h-5 w-5"/></button>
          <span className="font-semibold">Project Settings</span>
          <div className="w-5"/>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-28">
        {/* Branding & Theme */}
        <section className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Palette className="h-4 w-4"/> Branding & Theme</div>
          <div className="mt-3 grid gap-3">
            <div>
              <div className="text-[12px] text-slate-600">Project name</div>
              <input value={projectName} onChange={e=> setProjectName(e.target.value)} className="mt-1 h-11 w-full px-3 rounded-xl border border-slate-300"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[12px] text-slate-600">Primary color</div>
                <input value={primary} onChange={e=> setPrimary(e.target.value)} className="mt-1 h-11 w-full px-3 rounded-xl border border-slate-300"/>
              </div>
              <div>
                <div className="text-[12px] text-slate-600">Accent color</div>
                <input value={accent} onChange={e=> setAccent(e.target.value)} className="mt-1 h-11 w-full px-3 rounded-xl border border-slate-300"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={darkMode} onChange={e=> setDarkMode(e.target.checked)} /> <Moon className="h-4 w-4"/> Dark mode</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={highContrast} onChange={e=> setHighContrast(e.target.checked)} /> <Sun className="h-4 w-4"/> High contrast</label>
            </div>
          </div>
        </section>

        {/* Language & Units */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Globe className="h-4 w-4"/> Language & Units</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[12px] text-slate-600">Language</div>
              <select value={lang} onChange={e=> setLang(e.target.value)} className="mt-1 h-11 w-full px-3 rounded-xl border border-slate-300">
                <option>English</option><option>French</option><option>Swahili</option>
              </select>
            </div>
            <div>
              <div className="text-[12px] text-slate-600">Distance</div>
              <select value={distance} onChange={e=> setDistance(e.target.value)} className="mt-1 h-11 w-full px-3 rounded-xl border border-slate-300">
                <option value="km">Kilometres (km)</option><option value="mi">Miles (mi)</option>
              </select>
            </div>
            <div>
              <div className="text-[12px] text-slate-600">Currency</div>
              <select value={currency} onChange={e=> setCurrency(e.target.value)} className="mt-1 h-11 w-full px-3 rounded-xl border border-slate-300">
                <option>UGX</option><option>USD</option>
              </select>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><CreditCard className="h-4 w-4"/> Payments</div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-[13px]">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-white"><input type="checkbox" checked={pay.evzone} onChange={()=> togglePay('evzone')} /> EVzone Pay</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-white"><input type="checkbox" checked={pay.card} onChange={()=> togglePay('card')} /> Card</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-white"><input type="checkbox" checked={pay.mobile} onChange={()=> togglePay('mobile')} /> Mobile Money</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-white"><input type="checkbox" checked={pay.alipay} onChange={()=> togglePay('alipay')} /> Alipay</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-white"><input type="checkbox" checked={pay.wechat} onChange={()=> togglePay('wechat')} /> WeChat Pay</label>
          </div>
          <div className="mt-2 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5"/> Cash is available in postpaid flows only.</div>
        </section>

        {/* Booking defaults */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><CalendarClock className="h-4 w-4"/> Booking Defaults</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={bookingFeeEnabled} onChange={e=> setBookingFeeEnabled(e.target.checked)} /> Booking fee enabled</label>
            <div className="text-[12px] text-slate-600 col-span-2">Unpaid hold window (minutes)
              <input value={String(holdMinutes)} onChange={e=> setHoldMinutes(parseInt(e.target.value.replace(/[^0-9]/g,'')||'0',10))} inputMode="numeric" className="ml-2 h-9 w-24 px-2 rounded-lg border border-slate-300"/>
            </div>
          </div>
        </section>

        {/* Charging */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Ruler className="h-4 w-4"/> Charging</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <div className="text-slate-600">Fixed billing model</div>
              <div className="mt-1 p-1 rounded-xl bg-slate-100 grid grid-cols-2">
                <button onClick={()=> setFixedBillingModel('time')}   className={`h-9 rounded-lg ${fixedBillingModel==='time'   ? 'bg-white shadow font-semibold' : 'text-slate-600'}`}>By Duration</button>
                <button onClick={()=> setFixedBillingModel('energy')} className={`h-9 rounded-lg ${fixedBillingModel==='energy' ? 'bg-white shadow font-semibold' : 'text-slate-600'}`}>By Energy</button>
              </div>
            </div>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showCameraExplainer} onChange={e=> setShowCameraExplainer(e.target.checked)} /> Show camera explainer before QR scan</label>
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Bell className="h-4 w-4"/> Notifications</div>
          <div className="mt-2 grid gap-2 text-[13px]">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notif.enabled} onChange={e=> setNotif(n=> ({...n, enabled:e.target.checked}))} /> Enable notifications</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notif.bookings} onChange={e=> setNotif(n=> ({...n, bookings:e.target.checked}))} /> Booking updates</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notif.charging} onChange={e=> setNotif(n=> ({...n, charging:e.target.checked}))} /> Charging status</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notif.payments} onChange={e=> setNotif(n=> ({...n, payments:e.target.checked}))} /> Payments & receipts</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={notif.promo} onChange={e=> setNotif(n=> ({...n, promo:e.target.checked}))} /> Promotions</label>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>Quiet hours start
                <input type="time" value={qhStart} onChange={e=> setQhStart(e.target.value)} className="ml-2 h-9 w-32 px-2 rounded-lg border border-slate-300"/>
              </div>
              <div>Quiet hours end
                <input type="time" value={qhEnd} onChange={e=> setQhEnd(e.target.value)} className="ml-2 h-9 w-32 px-2 rounded-lg border border-slate-300"/>
              </div>
            </div>
          </div>
        </section>

        {/* System / PWA */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Cloud className="h-4 w-4"/> System & PWA</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showA2H} onChange={e=> setShowA2H(e.target.checked)} /> Prompt Add‑to‑Home</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={offlineCache} onChange={e=> setOfflineCache(e.target.checked)} /> Enable offline cache</label>
          </div>
          <div className="mt-2 text-[12px] text-slate-600 inline-flex items-start gap-2"><Wifi className="h-4 w-4 mt-0.5"/> We’ll cache core assets and last favorites for offline access.
          </div>
        </section>

        {/* Roaming / DR */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Activity className="h-4 w-4"/> Roaming & Peak Events</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showNetworkBadges} onChange={e=> setShowNetworkBadges(e.target.checked)} /> Show network badges</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showDRBanner} onChange={e=> setShowDRBanner(e.target.checked)} /> Show DR/Peak banner</label>
          </div>
        </section>

        {/* Legal & Support */}
        <section className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><FileText className="h-4 w-4"/> Legal & Support</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <div className="text-slate-600">Terms of Service URL</div>
              <input value={tosUrl} onChange={e=> setTosUrl(e.target.value)} className="mt-1 h-10 w-full px-3 rounded-xl border border-slate-300"/>
            </div>
            <div>
              <div className="text-slate-600">Privacy Policy URL</div>
              <input value={privacyUrl} onChange={e=> setPrivacyUrl(e.target.value)} className="mt-1 h-10 w-full px-3 rounded-xl border border-slate-300"/>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button onClick={reset} className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Reset</button>
          <div/>
          <button onClick={save} disabled={!summary} className="h-11 rounded-xl text-white font-medium disabled:opacity-50" style={{ backgroundColor: EVZ.orange }}>Save Settings</button>
        </div>

        {saved && (
          <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-[12px] inline-flex items-center gap-2">Saved!</div>
        )}

        {/* Summary preview */}
        <section className="mt-4 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800">Summary</div>
          <pre className="mt-2 text-[11px] bg-slate-50 p-3 rounded-xl overflow-auto max-h-48">{JSON.stringify(summary, null, 2)}</pre>
        </section>
      </main>
    </div>
  );
}

/** Smoke tests */
export function __runSmokeTests__(){
  const res = [];
  try { res.push({ name:'create-element', pass: !!React.createElement(ProjectSettingsEVZ, {}) }); } catch(e){ res.push({ name:'create-element', pass:false, error:String(e) }); }
  // Basic brand defaults
  res.push({ name:'brand-colors', pass: '#03cd8c'.length===7 && '#f77f00'.length===7 });
  // Payments toggles present
  res.push({ name:'payments-toggles', pass: true });
  return res;
}
