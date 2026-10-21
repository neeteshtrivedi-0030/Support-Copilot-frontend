'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 transition-all duration-150',
        hoverable && 'hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
