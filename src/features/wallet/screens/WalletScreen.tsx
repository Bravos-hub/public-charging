/**
 * Wallet Home Screen (TypeScript)
 */

import React, { useMemo, useState } from 'react';
import { Wallet as WalletIcon, CreditCard, Plus, Star, Info, RefreshCw, FileDown } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useApp } from '../../../core';
import type { PaymentMethod } from '../../../core/types';

interface MaskProps {
  last4?: string;
}

function Mask({ last4 = '1234' }: MaskProps): React.ReactElement {
  return <span>•••• {last4}</span>;
}

interface MethodRowProps {
  method: PaymentMethod & { exp?: string };
  onDefault?: (id: string) => void;
}

function MethodRow({ method, onDefault }: MethodRowProps): React.ReactElement {
  return (
    <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center text-slate-700">
          <CreditCard className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-800 truncate">
            {method.brand || 'Card'} <Mask last4={method.last4} />
          </div>
          {method.expiryMonth && method.expiryYear && (
            <div className="text-[11px] text-slate-600">
              Exp {String(method.expiryMonth).padStart(2, '0')}/{String(method.expiryYear).slice(-2)}
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-2 text-right">
        {method.isDefault ? (
          <div className="text-[11px] text-emerald-700 inline-flex items-center gap-1 justify-end">
            <Star className="h-3.5 w-3.5" /> Default
          </div>
        ) : (
          <button
            onClick={() => onDefault?.(method.id)}
            className="h-8 px-3 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700"
          >
            Set Default
          </button>
        )}
      </div>
    </div>
  );
}

interface WalletScreenProps {
  onTopUp?: () => void;
  onAddMethod?: () => void;
  onTransactions?: () => void;
}

export function WalletScreen({
  onTopUp,
  onAddMethod,
  onTransactions,
}: WalletScreenProps): React.ReactElement {
  const { wallet, setWallet } = useApp();
  const [loading, setLoading] = useState(false);

  const defaultMethod = useMemo(
    () => wallet.methods.find((m) => m.isDefault),
    [wallet.methods]
  );

  function setDefault(id: string): void {
    setWallet((w) => ({
      ...w,
      methods: w.methods.map((m) => ({ ...m, isDefault: m.id === id })),
    }));
  }

  function handleTopUp(): void {
    setLoading(true);
    setTimeout(() => {
      setWallet((w) => ({ ...w, balance: w.balance + 50000 }));
      setLoading(false);
      onTopUp?.();
    }, 600);
  }

  // Use demo data if wallet is empty
  const displayMethods =
    wallet.methods.length > 0
      ? wallet.methods
      : [
          {
            id: 'm1',
            type: 'card' as const,
            brand: 'Visa',
            last4: '4321',
            expiryMonth: 9,
            expiryYear: 2027,
            isDefault: true,
          },
          {
            id: 'm2',
            type: 'card' as const,
            brand: 'Mastercard',
            last4: '8888',
            expiryMonth: 2,
            expiryYear: 2026,
            isDefault: false,
          },
        ];

  const displayBalance = wallet.balance > 0 ? wallet.balance : 125000;

  return (
    <div className="w-full bg-white text-slate-900">
      <div className="px-4 py-4 pb-6">
        {/* Balance card */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-[12px] text-slate-500">EVzone Pay Balance</div>
          <div className="mt-1 text-[28px] font-bold tracking-tight">
            {wallet.currency} {displayBalance.toLocaleString()}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleTopUp}
              disabled={loading}
              className="h-11 rounded-xl text-white font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Top Up 50,000
            </button>
            <button
              className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
              onClick={onTransactions}
            >
              <FileDown className="h-4 w-4" /> Transactions
            </button>
          </div>
          <div className="mt-2 text-[12px] text-slate-600 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" />
            Funds may take a few seconds to appear after payment authorization.
          </div>
        </div>

        {/* Default method */}
        {defaultMethod && (
          <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="text-sm font-semibold text-slate-800">Default Payment Method</div>
            <div className="mt-2">
              <MethodRow method={defaultMethod} onDefault={setDefault} />
            </div>
          </div>
        )}

        {/* Methods */}
        <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm font-semibold text-slate-800">Payment Methods</div>
          <div className="mt-2 grid gap-2">
            {displayMethods.map((m) => (
              <MethodRow key={m.id} method={m} onDefault={setDefault} />
            ))}
          </div>
          <div className="mt-3">
            <button
              className="h-11 w-full rounded-xl text-white font-medium inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
              onClick={onAddMethod}
            >
              <Plus className="h-4 w-4" /> Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

