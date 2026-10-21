'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { clsx } from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../store/hooks';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  User,
  BarChart3,
  Users,
  Shield,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Chat Copilot', href: '/chat', icon: MessageSquare },
    { label: 'Knowledge Base', href: '/documents', icon: FileText },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Analytics & RAG', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
  ];

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 ease-in-out pt-16',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-6">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            {sidebarOpen && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Workspace
              </p>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-sm font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon
                      className={clsx(
                        'h-5 w-5 shrink-0',
                        isActive
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    {sidebarOpen && <span>{item.label}</span>}
                  </NextLink>
                );
              })}
            </nav>
          </div>

          {/* Admin Navigation */}
          {isAdmin && (
            <div>
              {sidebarOpen && (
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Admin Portal
                  </p>
                </div>
              )}
              <nav className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <NextLink
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon
                        className={clsx(
                          'h-5 w-5 shrink-0',
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      {sidebarOpen && <span>{item.label}</span>}
                    </NextLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* System info badge */}
        {sidebarOpen && (
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Enterprise Copilot v1.0
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              RAG Engine + Multi-turn LLM
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
