import React from 'react';
import { Sheet } from '../ui/Sheet';

export function FilterSheet({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }): React.ReactElement {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Filters">
      {children}
    </Sheet>
  );
}

