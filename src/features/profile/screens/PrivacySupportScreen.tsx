/**
 * Privacy & Support Screen (TypeScript)
 * Full-screen privacy and support settings
 */

import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, Download, Trash2, HelpCircle, Mail, Phone, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function PrivacySupportScreen(): React.ReactElement {
  const { back, push } = useNavigation();
  const [allowCrashReports, setAllowCrashReports] = useState(true);

  function handleViewPrivacyPolicy(): void {
    push('PRIVACY_POLICY');
  }

  function handleViewFAQs(): void {
    // In a real app, this would navigate to FAQs
    alert('FAQs coming soon!');
  }

  function handleEmailSupport(): void {
    const subject = encodeURIComponent('Support Request');
    const body = encodeURIComponent('Please describe your issue:');
    window.location.href = `mailto:support@evzone.com?subject=${subject}&body=${body}`;
  }

  function handleCallSupport(): void {
    window.location.href = 'tel:+256700000001';
  }

  function handleExportData(): void {
    // In a real app, this would export user data
    alert('Data export feature coming soon!');
  }

  function handleDeleteAccount(): void {
    // In a real app, this would show a confirmation dialog
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion feature coming soon!');
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Privacy & Support</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Data & Privacy Section */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-800 mb-4">Data & Privacy</div>
          
          {/* View Privacy Policy button */}
          <button
            onClick={handleViewPrivacyPolicy}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 mb-3 hover:bg-slate-50 transition-colors"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="text-[13px]">View Privacy Policy</span>
          </button>

          {/* Allow crash reports toggle */}
          <button
            onClick={() => setAllowCrashReports(!allowCrashReports)}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-between hover:bg-slate-50 transition-colors mb-3"
          >
            <span className="text-[13px]">Allow crash reports</span>
            <input
              type="checkbox"
              checked={allowCrashReports}
              onChange={(e) => setAllowCrashReports(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              onClick={(e) => e.stopPropagation()}
            />
          </button>

          {/* Export My Data button */}
          <button
            onClick={handleExportData}
            className="w-full h-11 px-3 rounded-lg bg-orange-500 text-white font-medium inline-flex items-center gap-2 mb-3 hover:bg-orange-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-[13px]">Export My Data</span>
          </button>

          {/* Delete My Account button */}
          <button
            onClick={handleDeleteAccount}
            className="w-full h-11 px-3 rounded-lg bg-red-500 text-white font-medium inline-flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-[13px]">Delete My Account</span>
          </button>
        </div>

        {/* Support Section */}
        <div>
          <div className="text-sm font-semibold text-slate-800 mb-4">Support</div>
          
          {/* View FAQs button */}
          <button
            onClick={handleViewFAQs}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 mb-3 hover:bg-slate-50 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
            <span className="text-[13px]">View FAQs</span>
          </button>

          {/* Email support button */}
          <button
            onClick={handleEmailSupport}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 mb-3 hover:bg-slate-50 transition-colors"
          >
            <Mail className="h-4 w-4 text-slate-500" />
            <span className="text-[13px]">Email support</span>
          </button>

          {/* Call support button */}
          <button
            onClick={handleCallSupport}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 mb-3 hover:bg-slate-50 transition-colors"
          >
            <Phone className="h-4 w-4 text-slate-500" />
            <span className="text-[13px]">Call +256 700 000 001</span>
          </button>

          {/* Informational note */}
          <div className="text-xs text-slate-600 flex items-start gap-2 mt-4">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>For emergencies at a station, call the posted operator number on site.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

