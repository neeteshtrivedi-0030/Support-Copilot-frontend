'use client';

import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';
import { InputProps } from '../../types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 7);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'block w-full rounded-lg border text-sm transition-colors duration-150',
              'py-2.5 px-3.5',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon || error ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-rose-400 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/30'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
              className
            )}
            {...props}
          />
          {error ? (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                {rightIcon}
              </div>
            )
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
