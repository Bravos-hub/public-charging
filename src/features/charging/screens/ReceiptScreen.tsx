/**
 * Receipt Screen (TypeScript)
 * Displays charging session receipt with share and PDF download functionality
 */

import React, { useMemo, useRef } from 'react';
import { ArrowLeft, Share2, Download } from 'lucide-react';
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

    const shareTitle = receiptData.type === 'charging' 
      ? 'EVzone Charging Receipt' 
      : receiptData.type === 'booking' 
      ? 'EVzone Booking Receipt' 
      : 'EVzone Payment Receipt';

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        return; // Successfully shared
      } catch (err: any) {
        // User cancelled - don't show error
        if (err.name === 'AbortError') {
          return;
        }
        // For other errors, fall through to PDF download option
        console.error('Error sharing:', err);
      }
    }

    // If Web Share API is not available or failed, generate and download PDF
    // This is better than copying to clipboard
    try {
      await handleDownloadPDF();
      // Optionally show a message
      if (window.confirm('Web Share is not available. A PDF has been downloaded. Would you like to share the PDF file?')) {
        // User can manually share the downloaded PDF
      }
    } catch (err) {
      console.error('Error generating PDF for share:', err);
      alert('Unable to share receipt. Please try downloading the PDF manually using the download button.');
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
        <div ref={receiptRef} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
          {/* Watermark - Logo in center of body */}
          <div 
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{
              transform: 'translate(-50%, -50%) rotate(-25deg)',
              left: '50%',
              top: '50%',
              zIndex: 0,
              userSelect: 'none',
              opacity: 0.07,
            }}
          >
            <img 
              src="/LANDSCAPE LOGOS-17.png" 
              alt="EVzone Watermark" 
              className="h-96 w-auto object-contain"
            />
          </div>

          {/* Professional Letterhead */}
          <div className="relative" style={{ borderBottom: '4px solid #F28C1B', zIndex: 1 }}>
            {/* Logo Header */}
            <div className="px-6 py-6 flex items-center justify-center">
              <img 
                src="/LANDSCAPE LOGOS-17.png" 
                alt="EVzone Logo" 
                className="max-h-24 w-auto object-contain"
              />
            </div>
          </div>

          {/* Receipt Content */}
          <div className="px-6 py-5 relative" style={{ zIndex: 1 }}>
            <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#00A878' }}>Invoice / Receipt</h2>
            
            <div className="mb-4 space-y-1">
              <p className="text-sm"><strong>Date:</strong> {receiptData.date}</p>
              <p className="text-sm"><strong>Invoice/Receipt No.:</strong> {receiptData.receiptId}</p>
              <p className="text-sm"><strong>Customer Name:</strong> {route.params?.userName || 'Customer'}</p>
            </div>

            {/* Invoice Table */}
            <table className="w-full border-collapse mt-5" style={{ fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#F28C1B', color: 'white' }}>
                  <th className="p-2.5 text-left">Description</th>
                  <th className="p-2.5 text-left">Quantity</th>
                  <th className="p-2.5 text-left">Unit Price</th>
                  <th className="p-2.5 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.type === 'charging' && (
                  <tr style={{ background: '#fafafa' }}>
                    <td className="p-2 border-b border-slate-200">
                      EV Charging - {receiptData.connectorType}
                      <div className="text-xs text-slate-500 mt-1">
                        {receiptData.stationName} • {receiptData.timeRange}
                      </div>
                    </td>
                    <td className="p-2 border-b border-slate-200">{receiptData.energy}</td>
                    <td className="p-2 border-b border-slate-200">{receiptData.pricePerKwh}</td>
                    <td className="p-2 border-b border-slate-200 font-semibold">
                      UGX {receiptData.subtotal.toLocaleString()}
                    </td>
                  </tr>
                )}
                {receiptData.type === 'booking' && (
                  <tr style={{ background: '#fafafa' }}>
                    <td className="p-2 border-b border-slate-200">
                      Booking Reservation - {receiptData.connectorType}
                      <div className="text-xs text-slate-500 mt-1">
                        {receiptData.stationName} • {receiptData.timeRange}
                      </div>
                    </td>
                    <td className="p-2 border-b border-slate-200">1</td>
                    <td className="p-2 border-b border-slate-200">UGX {receiptData.subtotal.toLocaleString()}</td>
                    <td className="p-2 border-b border-slate-200 font-semibold">
                      UGX {receiptData.subtotal.toLocaleString()}
                    </td>
                  </tr>
                )}
                {receiptData.type === 'payment' && (
                  <tr style={{ background: '#fafafa' }}>
                    <td className="p-2 border-b border-slate-200">
                      Payment - {receiptData.paymentMethod || 'Payment'}
                    </td>
                    <td className="p-2 border-b border-slate-200">1</td>
                    <td className="p-2 border-b border-slate-200">UGX {receiptData.subtotal.toLocaleString()}</td>
                    <td className="p-2 border-b border-slate-200 font-semibold">
                      UGX {receiptData.subtotal.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t-2 border-slate-200">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="text-sm font-semibold">UGX {receiptData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Tax</span>
                <span className="text-sm font-semibold">UGX {receiptData.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-slate-300">
                <span className="text-base font-bold">Grand Total</span>
                <span className="text-base font-bold" style={{ color: '#F28C1B' }}>
                  UGX {receiptData.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="px-6 py-5 text-xs text-center border-t-2"
            style={{ borderTopColor: '#00A878', color: '#555' }}
          >
            <p className="mb-1">Hotline & WeChat: +8617768319897</p>
            <p className="mb-3">Email: charging@evzonegroup.com | info@evzonegroup.com</p>
            <p className="mt-3"><strong>Thank you for your business.</strong></p>
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

