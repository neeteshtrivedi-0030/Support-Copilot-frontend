'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { DocumentStatus } from '../../types';

interface BadgeProps {
  status?: DocumentStatus | string;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  showPulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, variant, showPulse, className }) => {
  let displayLabel = label;
  let resolvedVariant = variant || 'default';
  let shouldPulse = showPulse;

  if (status) {
    switch (status.toLowerCase()) {
      case 'processed':
        displayLabel = label || 'Processed';
        resolvedVariant = 'success';
        break;
      case 'processing':
        displayLabel = label || 'Processing';
        resolvedVariant = 'warning';
        shouldPulse = true;
        break;
      case 'uploaded':
        displayLabel = label || 'Uploaded';
        resolvedVariant = 'info';
        break;
      case 'failed':
        displayLabel = label || 'Failed';
        resolvedVariant = 'danger';
        break;
      case 'admin':
        displayLabel = label || 'Admin';
        resolvedVariant = 'purple';
        break;
      case 'employee':
        displayLabel = label || 'Employee';
        resolvedVariant = 'default';
        break;
      default:
        displayLabel = label || status;
    }
  }

  const variantStyles = {
    default:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    success:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    purple:
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[resolvedVariant],
        className
      )}
    >
      {shouldPulse && (
        <Loader2 className="w-3 h-3 animate-spin text-amber-600 dark:text-amber-400" />
      )}
      {displayLabel}
    </span>
  );
};
