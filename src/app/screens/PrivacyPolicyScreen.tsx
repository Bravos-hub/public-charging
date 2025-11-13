/**
 * Privacy Policy Screen (TypeScript)
 * Full-screen wrapper for privacy policy
 */

import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation } from '../../core';

const PRIVACY_SECTIONS = [
  {
    number: 1,
    title: 'Data Collection',
    description: 'We collect information you provide directly, such as account details, payment information, and charging session data…',
  },
  {
    number: 2,
    title: 'Data Usage',
    description: 'We use your data to provide, maintain, and improve our services, process transactions, and communicate with you…',
  },
  {
    number: 3,
    title: 'Data Sharing',
    description: 'We may share your information with service providers, partners, and as required by law. We do not sell your personal data…',
  },
  {
    number: 4,
    title: 'Data Security',
    description: 'We implement appropriate technical and organizational measures to protect your personal information…',
  },
  {
    number: 5,
    title: 'Your Rights',
    description: 'You have the right to access, update, delete, or export your personal data. Contact us to exercise these rights…',
  },
  {
    number: 6,
    title: 'Cookies & Tracking',
    description: 'We use cookies and similar technologies to enhance your experience and analyze usage patterns…',
  },
  {
    number: 7,
    title: 'Changes to Policy',
    description: 'We may update this Privacy Policy from time to time. Continued use of our services means acceptance of changes…',
  },
];

export function PrivacyPolicyScreen(): React.ReactElement {
  const { back } = useNavigation();

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Privacy Policy</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-6 pb-24">
          <div className="space-y-4">
            {PRIVACY_SECTIONS.map((section) => (
              <div key={section.number} className="text-slate-900">
                <div className="text-sm font-semibold text-slate-800 mb-1">
                  {section.number}. {section.title}
                </div>
                <div className="text-[13px] text-slate-600 leading-relaxed">
                  {section.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

