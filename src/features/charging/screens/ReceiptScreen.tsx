/**
 * Receipt Screen (TypeScript)
 * Displays charging session receipt with share and PDF download functionality
 */

import React, { useMemo, useRef } from 'react';
import { ArrowLeft, Share2, Download, MapPin, Zap, Gauge, Clock, Calendar, Car } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import type { ChargingSession, Station, Connector, Booking } from '../../../core/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ReceiptType = 'charging' | 'booking' | 'payment';

export function ReceiptScreen(): React.ReactElement {
  const { route, back, replace } = useNavigation();
  const receiptRef = useRef<HTMLDivElement>(null);

  // Get data from route params - support multiple receipt types
  const session: ChargingSession | undefined = route.params?.session;
  const booking: Booking | undefined = route.params?.booking;
  const station: Station | undefined = route.params?.station;
  const connector: Connector | undefined = route.params?.connector;
  const paymentAmount: number | undefined = route.params?.amount;
  const paymentMethod: string | undefined = route.params?.paymentMethod;

  // Determine receipt type
  const receiptType: ReceiptType = useMemo(() => {
    if (session) return 'charging';
    if (booking) return 'booking';
    return 'payment';
  }, [session, booking]);

  // Calculate receipt data
  const receiptData = useMemo(() => {
    const now = new Date();
    
    // Generate receipt ID
    const receiptId = session?.receiptId 
      || booking?.id 
      || `EVZ-REC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    if (receiptType === 'charging' && session) {
      // Charging session receipt
      const energyKwh = session.energyDelivered || 32.8;
      const pricePerKwh = connector?.price || station?.price || 3000;
      const subtotal = Math.round(energyKwh * pricePerKwh);
      const tax = 0;
      const total = subtotal + tax;

      const startTime = session.startTime ? new Date(session.startTime) : new Date();
      const endTime = session.endTime ? new Date(session.endTime) : new Date(startTime.getTime() + 42 * 60000);
      
      const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const durationMs = endTime.getTime() - startTime.getTime();
      const hours = Math.floor(durationMs / 3600000);
      const minutes = Math.floor((durationMs % 3600000) / 60000);
      const durationStr = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;

      return {
        type: 'charging' as const,
        receiptId,
        stationName: station?.name || 'Central Hub — Downtown Mall',
        stationAddress: station?.address || 'Plot 10 Main St, Kampala, UG',
        date: startTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        connectorType: `${connector?.type || 'CCS2'} ${connector?.power || 60}kW`,
        energy: `${energyKwh} kWh`,
        timeRange: `${startTimeStr} — ${endTimeStr} (${durationStr})`,
        pricePerKwh: `UGX ${pricePerKwh.toLocaleString()}`,
        subtotal,
        tax,
        total,
      };
    } else if (receiptType === 'booking' && booking) {
      // Booking receipt
      const startTime = booking.startTime ? new Date(booking.startTime) : new Date();
      const endTime = booking.endTime ? new Date(booking.endTime) : new Date(startTime.getTime() + 90 * 60000);
      
      const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = startTime.toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });

      const subtotal = booking.cost || paymentAmount || 50000;
      const tax = 0;
      const total = subtotal + tax;

      return {
        type: 'booking' as const,
        receiptId,
        stationName: booking.stationName || station?.name || 'Central Hub — Downtown Mall',
        stationAddress: booking.stationAddress || station?.address || booking.location?.address || 'Plot 10 Main St, Kampala, UG',
        date: dateStr,
        timeRange: `${startTimeStr} — ${endTimeStr}`,
        connectorType: booking.connectorType || 'CCS2 60kW',
        vehicle: booking.vehicleName || 'Model X — UAX 123A',
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethod || 'EVzone Pay',
      };
    } else {
      // Payment receipt (standalone)
      const subtotal = paymentAmount || 0;
      const tax = 0;
      const total = subtotal + tax;

      return {
        type: 'payment' as const,
        receiptId,
        stationName: station?.name || 'Payment',
        stationAddress: station?.address || '',
        date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethod || 'EVzone Pay',
      };
    }
  }, [session, booking, station, connector, receiptType, paymentAmount, paymentMethod]);

  async function handleShare(): Promise<void> {
    let shareText = `EVzone Receipt\n\nReceipt ID: ${receiptData.receiptId}\n`;
    
    if (receiptData.type === 'charging') {
      shareText += `Station: ${receiptData.stationName}\nAddress: ${receiptData.stationAddress}\nDate: ${receiptData.date}\n\nEnergy: ${receiptData.energy}\nTime: ${receiptData.timeRange}\nConnector: ${receiptData.connectorType}\nPrice/kWh: ${receiptData.pricePerKwh}\n\n`;
    } else if (receiptData.type === 'booking') {
      shareText += `Station: ${receiptData.stationName}\nAddress: ${receiptData.stationAddress}\nDate: ${receiptData.date}\nTime: ${receiptData.timeRange}\nConnector: ${receiptData.connectorType}\nVehicle: ${receiptData.vehicle}\nPayment Method: ${receiptData.paymentMethod}\n\n`;
    } else {
      shareText += `Date: ${receiptData.date}\nPayment Method: ${receiptData.paymentMethod}\n\n`;
    }
    
    shareText += `Subtotal: UGX ${receiptData.subtotal.toLocaleString()}\nTax: UGX ${receiptData.tax.toLocaleString()}\nTotal: UGX ${receiptData.total.toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: receiptData.type === 'charging' ? 'EVzone Charging Receipt' : receiptData.type === 'booking' ? 'EVzone Booking Receipt' : 'EVzone Payment Receipt',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Receipt details copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        alert('Unable to share receipt. Please try downloading the PDF instead.');
      }
    }
  }

  async function handleDownloadPDF(): Promise<void> {
    if (!receiptRef.current) {
      return;
    }

    try {
      // Show loading state (optional)
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;
      const xOffset = (pdfWidth - imgScaledWidth) / 2;
      const yOffset = (pdfHeight - imgScaledHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);
      pdf.save(`EVzone-Receipt-${receiptData.receiptId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  function handleDone(): void {
    replace('ACTIVITY');
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Receipt</span>
          <div className="flex items-center gap-3">
            <button aria-label="Share" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </button>
            <button aria-label="Download PDF" onClick={handleDownloadPDF}>
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Receipt Card */}
        <div ref={receiptRef} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Receipt ID */}
          <div className="mb-4">
            <div className="text-[12px] text-slate-500 mb-1">Receipt ID</div>
            <div className="text-[14px] font-semibold text-slate-800">{receiptData.receiptId}</div>
          </div>

          {/* Station Information */}
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="flex items-start gap-2 mb-1">
              <MapPin className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-slate-800">{receiptData.stationName}</div>
                <div className="text-[12px] text-slate-600 mt-0.5">{receiptData.stationAddress}</div>
                <div className="text-[12px] text-slate-500 mt-1">{receiptData.date}</div>
              </div>
            </div>
          </div>

          {/* Parameters Grid */}
          {receiptData.type === 'charging' && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Connector */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                  <Zap className="h-4 w-4" />
                  Connector
                </div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.connectorType}</div>
              </div>

              {/* Energy */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                  <Gauge className="h-4 w-4" />
                  Energy
                </div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.energy}</div>
              </div>

              {/* Start/End Time */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                  <Clock className="h-4 w-4" />
                  Start / End
                </div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.timeRange}</div>
              </div>

              {/* Price per kWh */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 mb-1">Price / kWh</div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.pricePerKwh}</div>
              </div>
            </div>
          )}

          {receiptData.type === 'booking' && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Date & Time */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                  <Calendar className="h-4 w-4" />
                  Date & Time
                </div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.timeRange}</div>
              </div>

              {/* Connector */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                  <Zap className="h-4 w-4" />
                  Connector
                </div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.connectorType}</div>
              </div>

              {/* Vehicle */}
              {receiptData.vehicle && (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                    <Car className="h-4 w-4" />
                    Vehicle
                  </div>
                  <div className="text-[13px] font-semibold text-slate-800">{receiptData.vehicle}</div>
                </div>
              )}

              {/* Payment Method */}
              {receiptData.paymentMethod && (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-[11px] text-slate-500 mb-1">Payment Method</div>
                  <div className="text-[13px] font-semibold text-slate-800">{receiptData.paymentMethod}</div>
                </div>
              )}
            </div>
          )}

          {receiptData.type === 'payment' && receiptData.paymentMethod && (
            <div className="mb-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500 mb-1">Payment Method</div>
                <div className="text-[13px] font-semibold text-slate-800">{receiptData.paymentMethod}</div>
              </div>
            </div>
          )}

          {/* Cost Summary */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-600">Subtotal</span>
              <span className="text-[13px] font-semibold text-slate-800">UGX {receiptData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-600">Tax</span>
              <span className="text-[13px] font-semibold text-slate-800">UGX {receiptData.tax.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-slate-800">Total</span>
                <span className="text-[15px] font-semibold text-slate-800">UGX {receiptData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={back}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleDone}
            className="h-11 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Done
          </button>
        </div>
      </main>
    </div>
  );
}

