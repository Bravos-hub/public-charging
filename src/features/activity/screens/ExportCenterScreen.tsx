/**
 * Export Center Screen (TypeScript)
 * Allows users to export charging history data in CSV or PDF format
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Download, FileText } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function ExportCenterScreen(): React.ReactElement {
  const { back } = useNavigation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<'CSV' | 'PDF'>('CSV');

  // Format date for display (dd/mm/yyyy)
  function formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return 'dd/mm/yyyy';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Generate summary text
  const summary = useMemo(() => {
    const start = startDate ? formatDateForDisplay(startDate) : '—';
    const end = endDate ? formatDateForDisplay(endDate) : '—';
    return `${start} → ${end} • ${format}`;
  }, [startDate, endDate, format]);

  function handleExport(): void {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    // In a real app, this would trigger the actual export
    console.log('Exporting:', { startDate, endDate, format });
    alert(`${format} export started for ${formatDateForDisplay(startDate)} to ${formatDateForDisplay(endDate)}`);
  }

  function handleQuickCSV(): void {
    // Quick export with default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setFormat('CSV');
    
    // Auto-trigger export
    setTimeout(() => {
      alert('Quick CSV export started for the last 30 days');
    }, 100);
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Export Center</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Main Content Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          {/* Date Range Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Date range</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-11 px-3 pr-10 rounded-lg border border-slate-300 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-11 px-3 pr-10 rounded-lg border border-slate-300 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  placeholder="dd/mm/yyyy"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Format Section */}
          <div className="mb-6">
            <div className="text-[12px] text-slate-600 mb-2">Format</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('CSV')}
                className={`h-11 px-4 rounded-lg border-2 flex items-center justify-center gap-2 text-[13px] font-medium transition-colors ${
                  format === 'CSV'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {format === 'CSV' ? (
                  <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                )}
                <span>CSV</span>
              </button>
              <button
                onClick={() => setFormat('PDF')}
                className={`h-11 px-4 rounded-lg border-2 flex items-center justify-center gap-2 text-[13px] font-medium transition-colors ${
                  format === 'PDF'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {format === 'PDF' ? (
                  <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-400" />
                )}
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div>
            <div className="text-[12px] text-slate-600 mb-2">Summary</div>
            <div className="h-11 px-3 rounded-lg border border-slate-300 bg-white flex items-center text-[13px] text-slate-700">
              {summary}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleExport}
            className="w-full h-12 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 text-[14px]"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            <Download className="h-4 w-4" />
            Export {format}
          </button>
          <button
            onClick={handleQuickCSV}
            className="w-full h-12 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 text-[14px]"
          >
            <FileText className="h-4 w-4" />
            Quick CSV
          </button>
        </div>
      </main>
    </div>
  );
}


