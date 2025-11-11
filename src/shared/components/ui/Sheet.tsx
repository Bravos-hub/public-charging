/**
 * Bottom Sheet Component (TypeScript)
 * Draggable bottom sheet for mobile UI
 */

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Sheet({ isOpen, onClose, children, title }: SheetProps): React.ReactElement {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-xl max-h-[90vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="py-3 grid place-items-center cursor-pointer" onClick={onClose}>
              <div className="h-1.5 w-12 rounded-full bg-slate-300" />
            </div>
            {/* Content */}
            <div className="px-4 pb-6 overflow-y-auto max-h-[calc(90vh-3rem)]">
              {title && (
                <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

