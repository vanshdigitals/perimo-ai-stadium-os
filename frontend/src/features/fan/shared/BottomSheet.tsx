import React, { type ReactNode, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[70]",
              "bg-[#111118] border-t border-white/[0.08] rounded-t-3xl",
              "flex flex-col max-h-[90vh] lg:max-h-[85vh]",
              "shadow-2xl shadow-black",
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Handle / Header */}
            <div className="flex-shrink-0 flex flex-col items-center pt-3 pb-2 px-4 relative">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mb-3" />
              {title && (
                <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 safe-area-pb overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
