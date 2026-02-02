import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: 'purple' | 'green' | 'orange' | 'blue' | 'none';
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  description, 
  footer,
  icon,
  gradient = 'none',
  hover = false,
  glow = false
}) => {
  const gradientClasses = {
    none: '',
    purple: 'card-gradient-1',
    green: 'card-gradient-2',
    orange: 'card-gradient-3',
    blue: 'card-gradient-4'
  };

  return (
    <div className={`
      bg-white dark:bg-zinc-900/80 
      border border-slate-200 dark:border-zinc-800/80 
      rounded-2xl overflow-hidden 
      shadow-sm dark:shadow-none 
      transition-all duration-300
      ${gradientClasses[gradient]}
      ${hover ? 'hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer' : ''}
      ${glow ? 'ring-1 ring-indigo-500/20' : ''}
      ${className}
    `}>
      {(title || description || icon) && (
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{description}</p>
              )}
            </div>
            {icon && (
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {icon}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="bg-slate-50/50 dark:bg-zinc-950/50 border-t border-slate-200/50 dark:border-zinc-800/50 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};