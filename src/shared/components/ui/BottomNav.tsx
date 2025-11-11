/**
 * Bottom Navigation Bar Component (TypeScript)
 */

import React from 'react';
import { MapPin, CalendarClock, Wallet as WalletIcon, User, LucideIcon } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { key: 'DISCOVER', label: 'Discover', icon: MapPin },
  { key: 'ACTIVITY', label: 'Activity', icon: CalendarClock },
  { key: 'WALLET', label: 'Wallet', icon: WalletIcon },
  { key: 'PROFILE', label: 'Profile', icon: User },
];

export function BottomNav(): React.ReactElement {
  const { route, replace } = useNavigation();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40" style={{ background: EVZ_COLORS.green }}>
      <div className="mx-auto max-w-md">
        <nav className="flex items-center px-1">
          {tabs.map((tab) => {
            const active = route.name === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => replace(tab.key)}
                className={`flex-1 py-2 flex flex-col items-center gap-1 ${
                  active ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[11px] font-medium tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

