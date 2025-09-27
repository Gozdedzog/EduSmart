'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/useSidebar';
import { AccountSidebar } from '@/components/layout/AccountSidebar';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, loading, logout } = useAuth();
  const { isOpen, toggle, close } = useSidebar();

  const navItems = [
    { href: '/', label: 'Ana Sayfa', icon: '🏠' },
    { href: '/icerikler', label: 'İçerikler', icon: '📚' },
    { href: '/testler', label: 'Testler', icon: '🧠' },
    { href: '/sonuclar', label: 'Sonuçlar', icon: '📊' },
    { href: '/hakkinda', label: 'Hakkında', icon: 'ℹ️' },
    { href: '/iletisim', label: 'İletişim', icon: '💬' },
  ];

  return (
    <>
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Sidebar Toggle & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggle}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-controls="hesap-paneli"
                aria-expanded={isOpen}
                aria-label="Hesap panelini aç"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-2xl">📘</div>
              <div>
                <div className="text-lg font-bold text-slate-900">EduSmart</div>
                <div className="text-xs text-slate-500">
                  Yapay Zekâ Destekli Öğrenme
                </div>
              </div>
            </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors ${
                    isActive
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`.trim()
                    : user.user_metadata?.full_name || user.email.split('@')[0]
                  }
                  {role === 'admin' && (
                    <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 rounded">
                      Admin
                    </span>
                  )}
                </span>
                <Button onClick={logout} variant="outline" size="sm">
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Giriş
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Kayıt Ol</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    
    {/* Account Sidebar */}
    <AccountSidebar isOpen={isOpen} onClose={close} />
    </>
  );
}
