import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const Toaster: React.FC = () => {
  const { notifications, removeNotification } = useAppStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          className={`
            min-w-[300px] px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-slide-up flex items-center justify-between
            ${toast.type === 'success' ? 'bg-zinc-900 border-green-900 text-green-400' : ''}
            ${toast.type === 'error' ? 'bg-zinc-900 border-red-900 text-red-400' : ''}
            ${toast.type === 'info' ? 'bg-zinc-900 border-blue-900 text-blue-400' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            )}
            {toast.type === 'error' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            {toast.type === 'info' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span>{toast.message}</span>
          </div>
          <button 
            onClick={() => removeNotification(toast.id)}
            className="ml-4 hover:text-white opacity-60 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};