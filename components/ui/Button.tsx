import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 rounded-xl font-medium 
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 
    disabled:opacity-50 disabled:pointer-events-none
    active:scale-[0.98]
  `;
  
  const variants = {
    primary: `
      bg-indigo-600 text-white 
      hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25
      focus:ring-indigo-500 
      shadow-md shadow-indigo-500/20
    `,
    secondary: `
      bg-white dark:bg-zinc-800 
      text-slate-700 dark:text-zinc-100 
      hover:bg-slate-50 dark:hover:bg-zinc-700 
      focus:ring-zinc-500 
      border border-slate-200 dark:border-zinc-700 
      shadow-sm
    `,
    ghost: `
      bg-transparent 
      text-slate-600 dark:text-zinc-400 
      hover:text-slate-900 dark:hover:text-zinc-100 
      hover:bg-slate-100 dark:hover:bg-zinc-800
    `,
    danger: `
      bg-red-600 text-white 
      hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25
      focus:ring-red-500 
      shadow-md shadow-red-500/20
    `,
    gradient: `
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
      text-white 
      hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25
      focus:ring-purple-500
      shadow-md shadow-purple-500/20
    `,
    outline: `
      bg-transparent 
      text-indigo-600 dark:text-indigo-400 
      border-2 border-indigo-600 dark:border-indigo-500
      hover:bg-indigo-50 dark:hover:bg-indigo-500/10
      focus:ring-indigo-500
    `
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Загрузка...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};