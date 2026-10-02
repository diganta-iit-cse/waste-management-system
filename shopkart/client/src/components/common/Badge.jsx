import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    dark: 'bg-gray-800 text-white border-gray-700'
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2 py-0.5 font-semibold',
    md: 'text-sm px-2.5 py-1 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
