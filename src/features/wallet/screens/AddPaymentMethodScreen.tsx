/**
 * Add Payment Method Screen (TypeScript)
 * Allows users to add credit card or mobile money payment methods
 */

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Lock } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import { useApp } from '../../../core';

type PaymentMethodType = 'card' | 'mobile';

export function AddPaymentMethodScreen(): React.ReactElement {
  const { back, replace } = useNavigation();
  const { setWallet, wallet } = useApp();
  const [methodType, setMethodType] = useState<PaymentMethodType>('card');
  
  // Card fields
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [nameOnCard, setNameOnCard] = useState('Jane Doe');
  const [expiry, setExpiry] = useState('09/27');
  const [cvv, setCvv] = useState('123');
  
  // Mobile Money fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'mtn' | 'airtel' | 'africell'>('mtn');

  function formatCardNumber(value: string): string {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.match(/.{1,4}/g)?.join(' ') || digits;
  }

  function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 4) {
      setExpiry(formatted);
    }
  }

  function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length <= 4) {
      setCvv(digits);
    }
  }

  function handleSave(): void {
    if (methodType === 'card') {
      // Validate card fields
      const cardDigits = cardNumber.replace(/\s/g, '');
      if (cardDigits.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      if (!nameOnCard.trim()) {
        alert('Please enter the name on card');
        return;
      }
      if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (cvv.length < 3) {
        alert('Please enter a valid CVV');
        return;
      }

      // Extract card brand from first digit
      const firstDigit = cardDigits[0];
      let brand = 'Visa';
      if (firstDigit === '5') brand = 'Mastercard';
      if (firstDigit === '3') brand = 'American Express';

      // Add card to wallet
      const newMethod = {
        id: `card-${Date.now()}`,
        type: 'card' as const,
        last4: cardDigits.slice(-4),
        brand,
        expiryMonth: parseInt(expiry.split('/')[0]),
        expiryYear: 2000 + parseInt(expiry.split('/')[1]),
        isDefault: wallet.methods.length === 0,
      };

      setWallet({
        ...wallet,
        methods: [...wallet.methods, newMethod],
      });
    } else {
      // Validate mobile money fields
      if (!phoneNumber.trim()) {
        alert('Please enter a phone number');
        return;
      }
      if (phoneNumber.replace(/\D/g, '').length < 9) {
        alert('Please enter a valid phone number');
        return;
      }

      // Add mobile money to wallet (as a card type for now, could be extended)
      const newMethod = {
        id: `mobile-${Date.now()}`,
        type: 'card' as const, // Using card type for now
        brand: provider.toUpperCase(),
        last4: phoneNumber.slice(-4),
        isDefault: wallet.methods.length === 0,
      };

      setWallet({
        ...wallet,
        methods: [...wallet.methods, newMethod],
      });
    }

    // Navigate back to wallet
    replace('WALLET');
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Add Payment Method</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Method Type Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setMethodType('card')}
            className={`h-11 px-4 rounded-lg flex items-center justify-center gap-2 text-[13px] font-medium transition-colors ${
              methodType === 'card'
                ? 'bg-white shadow border border-slate-200 text-slate-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Card
          </button>
          <button
            onClick={() => setMethodType('mobile')}
            className={`h-11 px-4 rounded-lg flex items-center justify-center gap-2 text-[13px] font-medium transition-colors ${
              methodType === 'mobile'
                ? 'bg-white shadow border border-slate-200 text-slate-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Mobile Money
          </button>
        </div>

        {/* Card Form */}
        {methodType === 'card' && (
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            {/* Card Number */}
            <div className="mb-4">
              <label className="block text-[12px] text-slate-600 mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full h-11 px-3 rounded-lg border border-slate-300 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>

            {/* Name on Card */}
            <div className="mb-4">
              <label className="block text-[12px] text-slate-600 mb-2">Name on Card</label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[12px] text-slate-600 mb-2">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[12px] text-slate-600 mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Security Info */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              <span>Data is encrypted and never stored on device.</span>
            </div>
          </div>
        )}

        {/* Mobile Money Form */}
        {methodType === 'mobile' && (
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-[12px] text-slate-600 mb-2">Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {(['mtn', 'airtel', 'africell'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={`h-11 rounded-lg border-2 text-[12px] font-medium transition-colors ${
                      provider === p
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[12px] text-slate-600 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="0700 000 000"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={back}
            className="h-12 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-[14px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-12 rounded-xl text-white font-medium text-[14px]"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Save Method
          </button>
        </div>
      </main>
    </div>
  );
}

