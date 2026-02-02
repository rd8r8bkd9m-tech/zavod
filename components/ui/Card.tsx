import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, footer }) => {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-all ${className}`}>
      {(title || description) && (
        <div className="p-6 pb-2">
          {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{title}</h3>}
          {description && <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 p-4">
          {footer}
        </div>
      )}
    </div>
  );
};