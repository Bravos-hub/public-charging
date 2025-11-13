/**
 * Terms of Service Screen (TypeScript)
 * Full-screen wrapper for terms of service with accept/decline actions
 */

import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation } from '../../core';

const TERMS = [
  {
    number: 1,
    title: 'Introduction',
    description: 'Welcome to EVzone. By using our services you agree to these terms…',
  },
  {
    number: 2,
    title: 'Accounts',
    description: 'Users are responsible for maintaining the security of their account…',
  },
  {
    number: 3,
    title: 'Charging Sessions',
    description: 'Use compatible connectors and follow on-site safety guidelines…',
  },
  {
    number: 4,
    title: 'Payments & Refunds',
    description: 'Prepaid and postpaid terms, fees, and refund policies…',
  },
  {
    number: 5,
    title: 'Privacy',
    description: 'We process data according to our Privacy Policy…',
  },
  {
    number: 6,
    title: 'Liability',
    description: 'EVzone is not liable for…',
  },
  {
    number: 7,
    title: 'Changes',
    description: 'We may update these terms. Continued use means acceptance…',
  },
];

export function TermsOfServiceScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();

  function handleDecline(): void {
    // Navigate back or to a declined state
    back();
  }

  function handleAccept(): void {
    // Call the onAccept callback if provided, or navigate
    const onAccept = route.params?.onAccept;
    if (onAccept) {
      onAccept();
    } else {
      back();
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">Terms of Service</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-6 pb-24">
          <div className="space-y-4">
            {TERMS.map((term) => (
              <div key={term.number} className="text-slate-900">
                <div className="text-sm font-semibold text-slate-800 mb-1">
                  {term.number}. {term.title}
                </div>
                <div className="text-[13px] text-slate-600 leading-relaxed">
                  {term.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Action buttons - fixed at bottom */}
      <div className="sticky bottom-0 w-full bg-white border-t border-slate-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDecline}
              className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="h-11 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

