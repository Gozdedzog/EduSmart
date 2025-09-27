'use client';

import { useAuth } from '@/context/HybridAuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { canAccessAdmin } from '@/lib/auth/utils';

interface RequireAdminProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAdmin({ children, fallback }: RequireAdminProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?next=${encodeURIComponent(currentPath)}`);
    } else if (!loading && user && !canAccessAdmin(role)) {
      // Redirect to dashboard if not admin
      router.push('/dashboard');
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  if (!user || !canAccessAdmin(role)) {
    return null;
  }

  return <>{children}</>;
}
