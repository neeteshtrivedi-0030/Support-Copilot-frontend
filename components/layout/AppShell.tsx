'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';
import { useAppSelector } from '../../store/hooks';
import { clsx } from 'clsx';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAuthPage) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {children}
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={clsx(
            'flex-1 transition-all duration-200 ease-in-out p-4 sm:p-6 lg:p-8 min-w-0',
            sidebarOpen ? 'ml-64' : 'ml-20'
          )}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
