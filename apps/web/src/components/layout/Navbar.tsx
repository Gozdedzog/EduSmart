'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/HybridAuthProvider';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, User, LogOut, Settings, BarChart3 } from 'lucide-react';

export function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show shadow when scrolled > 8px
      setIsScrolled(currentScrollY > 8);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setIsHidden(true);
        } else {
          // Scrolling up - show navbar
          setIsHidden(false);
        }
      } else {
        // Always show when near top
        setIsHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/icerikler', label: 'Eğitimler' },
    { href: '/hakkinda', label: 'Hakkında' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 backdrop-blur-xl bg-white/95 border-b border-border/50 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'shadow-lg shadow-black/5' : 'shadow-sm'}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 font-semibold group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold gradient-text">EduSmart</div>
            <div className="text-xs text-muted-foreground -mt-1">Yapay Zekâ Destekli Öğrenme</div>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Button */}
        {!loading && (user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-xl bg-white border-2 border-primary/20 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 active:scale-95">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="gradient-text font-semibold">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`.trim()
                    : user.user_metadata?.full_name || user.email.split('@')[0]
                  }
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl shadow-lg border border-border/50" align="end" forceMount>
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard')}
                className="rounded-lg mx-1 my-1 focus:bg-accent/50 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push('/profile')}
                className="rounded-lg mx-1 my-1 focus:bg-accent/50 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profil
              </DropdownMenuItem>
              {role === 'admin' && (
                <>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    onClick={() => router.push('/admin')}
                    className="rounded-lg mx-1 my-1 focus:bg-accent/50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Paneli
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                onClick={async () => { await logout(); router.push('/'); }}
                className="rounded-lg mx-1 my-1 focus:bg-destructive/10 focus:text-destructive flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <button className="rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:from-primary/90 hover:to-primary/70 transition-all duration-200 active:scale-95">
              Giriş Yap
            </button>
          </Link>
        ))}
      </div>
    </header>
  );
}
