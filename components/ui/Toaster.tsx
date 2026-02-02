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
            min-w-[320px] max-w-[400px] px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium 
            animate-slide-up flex items-center justify-between backdrop-blur-xl
            ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10' : ''}
            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-blue-500/10' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            )}
            <span className="text-white/90">{toast.message}</span>
          </div>
          <button 
            onClick={() => removeNotification(toast.id)}
            className="ml-4 p-1.5 rounded-lg hover:bg-white/10 opacity-60 hover:opacity-100 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};