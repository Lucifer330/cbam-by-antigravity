import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onCloseToast: (id: string) => void;
}

export const ToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  let icon = <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />;
  let borderClass = 'border-[#2d3134]';

  if (toast.type === 'warning') {
    icon = <AlertTriangle className="w-4 h-4 text-[#f8dfaa] shrink-0" />;
    borderClass = 'border-[#804b02]';
  } else if (toast.type === 'info') {
    icon = <Info className="w-4 h-4 text-[#93c5fd] shrink-0" />;
    borderClass = 'border-[#1e3a8a]';
  }

  return (
    <div 
      className={`pointer-events-auto w-80 max-w-full bg-[#191c1e] text-white p-3.5 rounded-[6px] shadow-xl border ${borderClass} flex items-start justify-between gap-3 animate-toast-in`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="text-xs font-semibold tracking-tight text-white">
            {toast.title}
          </div>
          {toast.message && (
            <div className="text-[11px] text-[#a0a5aa] mt-0.5 font-normal leading-normal">
              {toast.message}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="p-1 rounded text-[#848a90] hover:text-white hover:bg-[#2d3134] transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onCloseToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onCloseToast} />
      ))}
    </div>
  );
};
