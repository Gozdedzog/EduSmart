'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/HybridAuthProvider';
import { ArrowRight, Loader2 } from 'lucide-react';

export function StartNowButton() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleClick = () => {
    if (loading) {
      return; // Loading durumunda hiçbir şey yapma
    }
    
    if (user) {
      // Kullanıcı giriş yapmışsa direkt içerikler sayfasına yönlendir
      router.push('/icerikler');
    } else {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      router.push('/auth/login?next=%2Ficerikler');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Yükleniyor...
        </>
      ) : (
        <>
          Hemen Başla
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </button>
  );
} 