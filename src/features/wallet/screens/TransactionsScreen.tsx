/**
 * Transactions Screen (TypeScript)
 * Lists wallet transactions with filters, CSV export, and actions.
 */

import React, { useMemo, useState } from 'react';
import { ArrowLeft, Filter, FileDown, CreditCard, PlugZap, Wallet, RefreshCw, Search, Receipt, Undo2 } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

type TxType = 'charge' | 'topup' | 'refund';
type TxStatus = 'completed' | 'pending' | 'failed' | 'refunded';

interface TxItem {
  id: string;
  type: TxType;
  date: string; // ISO
  amount: number; // UGX
  status: TxStatus;
  method?: { brand?: string; last4?: string };
  stationName?: string; // for charge
  sessionId?: string; // for charge
  used?: number; // for refund calc demos
  fee?: number; // for refund calc demos
}

function TypeBadge({ type }: { type: TxType }): React.ReactElement {
  const map: Record<TxType, { label: string; icon: React.ReactElement; tone: string }> = {
    charge: { label: 'Charge', icon: <PlugZap className="h-3.5 w-3.5" />, tone: 'bg-blue-50 text-blue-700 border-blue-200' },
    topup: { label: 'Top‑up', icon: <Wallet className="h-3.5 w-3.5" />, tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    refund: { label: 'Refund', icon: <Undo2 className="h-3.5 w-3.5" />, tone: 'bg-amber-50 text-amber-800 border-amber-200' },
  };
  const v = map[type];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${v.tone}`}>{v.icon}{v.label}</span>;
}

function StatusDot({ status }: { status: TxStatus }): React.ReactElement {
  const tone = status === 'completed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : status === 'failed' ? 'bg-rose-500' : 'bg-slate-400';
  return <span className={`inline-block h-2 w-2 rounded-full ${tone}`} />;
}

export function TransactionsScreen(): React.ReactElement {
  const { back, push } = useNavigation();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all' | TxType>('all');
  const [month, setMonth] = useState<string>(() => new Date().toISOString().slice(0, 7)); // yyyy-mm
  const [exporting, setExporting] = useState(false);

  // Demo dataset
  const data = useMemo<TxItem[]>(
    () => [
      { id: 'TX-20251112-001', type: 'charge', date: '2025-11-12T15:12:00Z', amount: 98400, status: 'completed', stationName: 'Central Hub — Downtown Mall', sessionId: 'SESSION-123', method: { brand: 'Visa', last4: '4321' } },
      { id: 'TX-20251112-002', type: 'topup', date: '2025-11-12T12:20:00Z', amount: 100000, status: 'completed', method: { brand: 'Mastercard', last4: '8888' } },
      { id: 'TX-20251110-003', type: 'refund', date: '2025-11-10T09:10:00Z', amount: 42000, status: 'completed', method: { brand: 'Visa', last4: '4321' }, used: 38000, fee: 2000 },
      { id: 'TX-20251105-004', type: 'charge', date: '2025-11-05T17:40:00Z', amount: 64800, status: 'refunded', stationName: 'Airport Park — Lot B', sessionId: 'SESSION-456', method: { brand: 'Visa', last4: '4321' } },
    ],
    []
  );

  const filtered = useMemo(() => {
    const monthPrefix = month + '-';
    return data
      .filter((t) => (type === 'all' ? true : t.type === type))
      .filter((t) => t.date.startsWith(monthPrefix))
      .filter((t) => (q ? (t.stationName || t.id).toLowerCase().includes(q.toLowerCase()) : true))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data, type, month, q]);

  function exportCsv(): void {
    setExporting(true);
    const header = ['id', 'type', 'date', 'amount', 'status', 'method', 'stationName'];
    const rows = filtered.map((t) => [t.id, t.type, t.date, String(t.amount), t.status, `${t.method?.brand || ''} ${t.method?.last4 || ''}`.trim(), t.stationName || '']);
    const csv = [header.join(','), ...rows.map((r) => r.map((v) => (`"${String(v).replace(/"/g, '""')}"`)).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `transactions_${month}.csv`; a.click();
    setTimeout(() => { URL.revokeObjectURL(url); setExporting(false); }, 300);
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Transactions</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Filters */}
        <div className="p-3 rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-4 gap-2 text-[12px]">
            {([
              { k: 'all', label: 'All' },
              { k: 'charge', label: 'Charges' },
              { k: 'topup', label: 'Top‑ups' },
              { k: 'refund', label: 'Refunds' },
            ] as const).map((o) => (
              <button
                key={o.k}
                onClick={() => setType(o.k)}
                className={`h-9 rounded-xl border ${type === o.k ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <div className="relative">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by station or ID" className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-300 text-[13px]" />
              <Search className="h-4 w-4 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-10 rounded-xl border border-slate-300 text-[13px] px-3" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => setType('all')} className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" /> Reset Filters
            </button>
            <button onClick={exportCsv} disabled={exporting} className="h-10 rounded-xl text-white inline-flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: EVZ_COLORS.orange }}>
              {exporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} Export CSV
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 grid gap-2">
          {filtered.map((t) => (
            <div key={t.id} className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[12px]">
                  <TypeBadge type={t.type} />
                  <span className="text-slate-500">{new Date(t.date).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="mt-1 text-[13px] font-semibold text-slate-800 truncate">
                  {t.type === 'charge' ? (t.stationName || 'Charging Session') : t.type === 'topup' ? 'Top‑up' : 'Refund'}
                </div>
                <div className="text-[11px] text-slate-600 truncate">
                  {t.method?.brand ? (
                    <span className="inline-flex items-center gap-1"><CreditCard className="h-3 w-3" /> {t.method.brand} •••• {t.method.last4}</span>
                  ) : (
                    '—'
                  )}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-600">
                  <StatusDot status={t.status} /> <span className="capitalize">{t.status}</span> • <span className="font-mono">{t.id}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-semibold">UGX {t.amount.toLocaleString()}</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {t.type === 'charge' && (
                    <button onClick={() => push('RECEIPT', { session: { id: t.sessionId }, amount: t.amount })} className="h-8 px-3 rounded-lg border border-slate-300 bg-white text-[12px]">
                      <Receipt className="h-3.5 w-3.5 inline mr-1" /> Receipt
                    </button>
                  )}
                  {(t.type === 'charge' || t.type === 'topup') && t.status === 'completed' && (
                    <button onClick={() => push('REFUND_VOID', { amount: t.amount, used: t.used ?? Math.round(t.amount * 0.38), fee: t.fee ?? 2000 })} className="h-8 px-3 rounded-lg text-white text-[12px]" style={{ backgroundColor: EVZ_COLORS.orange }}>
                      Refund
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-white text-[13px] text-slate-600">No transactions for {month}.</div>
          )}
        </div>
      </main>
    </div>
  );
}

