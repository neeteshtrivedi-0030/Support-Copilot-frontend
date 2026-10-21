'use client';

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { User, Mail, Shield, Building, Key, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            User Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise authentication credentials and role permissions
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
          className="text-rose-600 hover:bg-rose-50"
        >
          Sign Out
        </Button>
      </div>

      <Card className="space-y-6">
        {/* Avatar header */}
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge status={user.role} />
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                {user.department} Department
              </span>
            </div>
          </div>
        </div>

        {/* Identity details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-brand-500" /> Full Name
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-brand-500" /> Email Address
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-brand-500" /> System Role
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
              {user.role} {isAdmin && '(Elevated Access)'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Building className="w-3.5 h-3.5 text-brand-500" /> Department Scope
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
              {user.department}
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                JWT Authentication Active
              </p>
              <p className="text-[11px] text-slate-400">
                Tokens automatically refresh before expiration.
              </p>
            </div>
          </div>
          <span className="text-emerald-600 font-semibold text-xs">Connected</span>
        </div>
      </Card>
    </div>
  );
}
