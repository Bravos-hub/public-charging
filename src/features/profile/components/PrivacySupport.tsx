import React from 'react';
import { Shield, HelpCircle } from 'lucide-react';

export function PrivacySupport(): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-2 text-[13px] text-slate-700">
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><Shield className="h-4 w-4" /> Privacy</div>
      <div>We process data according to our Privacy Policy. Manage your data preferences in settings.</div>
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 mt-2"><HelpCircle className="h-4 w-4" /> Support</div>
      <div>Need help? Contact support from the Help section.</div>
    </div>
  );
}

