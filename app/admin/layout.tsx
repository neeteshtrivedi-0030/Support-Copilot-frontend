'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      router.replace('/dashboard?error=unauthorized');
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || (user && !isAdmin)) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-2" />
        <p className="text-xs text-slate-400">Verifying administrator privileges...</p>
      </div>
    );
  }

  return <div className="animate-fade-in">{children}</div>;
}
