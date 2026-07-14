import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Something went wrong loading this widget.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4">
    <div className="w-9 h-9 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-3">
      <AlertTriangle className="w-4.5 h-4.5 text-[#EF4444]" />
    </div>
    <p className="text-[13px] font-medium text-[#991B1B]">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-3 px-3 py-1.5 bg-white border border-[#E2E8F0] text-[#0F172A] text-[12px] font-medium rounded-[6px] hover:bg-[#F1F5F9] transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);
