/**
 * Profile & Settings Screen (TypeScript)
 * Full-screen profile and account settings
 */

import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Shield, LogOut, Save, Info, Zap } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import { useApp } from '../../../core';

export function ProfileSettingsScreen(): React.ReactElement {
  const { back } = useNavigation();
  const { auth, drPeak, setDrPeak } = useApp();
  const user = auth.user;
  
  // Form state
  const [fullName, setFullName] = useState(user?.name || 'Ronald Isabirye');
  const [email, setEmail] = useState(user?.email || 'ronald@example.com');
  const [phone, setPhone] = useState(user?.phone || '+256700000001');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  function handleSave(): void {
    // In a real app, this would save the user data
    console.log('Saving profile:', { fullName, email, phone, twoFactorEnabled });
    // Navigate back after saving
    back();
  }

  function handleSignOut(): void {
    // In a real app, this would sign out the user
    console.log('Signing out...');
    // Could navigate to login screen or clear session
    back();
  }

  function handleChangePassword(): void {
    // In a real app, this would navigate to change password screen
    console.log('Change password');
    alert('Change password feature coming soon!');
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
            <User className="h-5 w-5" />
            <span className="font-semibold">Profile & Settings</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

        {/* Pricing & Tariffs */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-800 mb-4">Pricing & Tariffs</div>
          <div className="grid gap-3">
            <button
              onClick={() => setDrPeak((s) => ({ ...s, active: !s.active }))}
              className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate-500" />
                <span className="text-[13px]">DR Peak event banner</span>
              </div>
              <input
                type="checkbox"
                checked={!!drPeak.active}
                readOnly
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                onClick={(e) => e.stopPropagation()}
              />
            </button>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">DR Peak until</label>
              <input
                type="time"
                value={drPeak.until || ''}
                onChange={(e) => setDrPeak((s) => ({ ...s, until: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              <div className="mt-2 text-xs text-slate-500 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5" />
                <span>Shows a peak pricing banner on Discover. Use for DR events/testing.</span>
              </div>
            </div>
          </div>
        </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Account Section */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-800 mb-4">Account</div>
          
          {/* Full name */}
          <div className="mb-3">
            <label className="block text-xs text-slate-600 mb-1.5">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-xs text-slate-600 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 bg-white text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Phone</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Phone className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 bg-white text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-800 mb-4">Security</div>
          
          {/* Change password button */}
          <button
            onClick={handleChangePassword}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2 mb-3 hover:bg-slate-50 transition-colors"
          >
            <Lock className="h-4 w-4 text-slate-500" />
            <span className="text-[13px]">Change password</span>
          </button>

          {/* Two-factor toggle */}
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <span className="text-[13px]">Two-factor</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              onClick={(e) => e.stopPropagation()}
            />
          </button>

          {/* Info text */}
          <div className="mt-3 text-xs text-slate-600 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>We'll guide you through a quick verification if you enable two-factor.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSignOut}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
          <button
            onClick={handleSave}
            className="h-11 rounded-xl bg-orange-500 text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </main>
    </div>
  );
}
