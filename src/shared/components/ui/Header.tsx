/**
 * App Header Component (TypeScript)
 */

import React from 'react';
import { MapPin, Compass, LucideIcon } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface HeaderProps {
  title: string;
  location?: string;
  rightAction?: React.ReactNode;
  icon?: LucideIcon;
}

export function Header({ title, location = 'Kampala', rightAction, icon: Icon = MapPin }: HeaderProps): React.ReactElement {
  return (
    <div className="sticky top-0 z-30" style={{ backgroundColor: EVZ_COLORS.green }}>
      <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
        <div className="inline-flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="font-semibold truncate">{title}</span>
        </div>
        {rightAction || (
          <button className="inline-flex items-center gap-2 text-sm" title="Location">
            <Compass className="h-4 w-4" />
            {location}
          </button>
        )}
      </div>
    </div>
  );
}

