'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/HybridAuthProvider';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/useSidebar';

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSidebar({ isOpen, onClose }: AccountSidebarProps) {
  const { user, logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap
      const focusableElements = sidebarRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="hesap-paneli"
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-neutral-900 shadow-xl transform transition-transform duration-200 will-change-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="sidebar-title" className="text-lg font-semibold text-gray-900">
              Hesap Paneli
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Paneli kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {user ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`.trim()
                          : user.user_metadata?.full_name || user.email.split('@')[0]
                        }
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <Link
                    href="/profil"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-lg">👤</span>
                    <span>Profil</span>
                  </Link>
                  <Link
                    href="/iceriklerim"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-lg">📚</span>
                    <span>İçeriklerim</span>
                  </Link>
                  <Link
                    href="/testler"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-lg">🧠</span>
                    <span>Testler</span>
                  </Link>
                  <Link
                    href="/sonuclar"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-lg">📊</span>
                    <span>Sonuçlar</span>
                  </Link>
                  <Link
                    href="/ayarlar"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Ayarlar</span>
                  </Link>
                </nav>

                {/* Logout Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Çıkış
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Hesabınıza giriş yapın
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Öğrenme yolculuğunuza devam etmek için giriş yapın
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/login" onClick={onClose}>
                    <Button className="w-full">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={onClose}>
                    <Button variant="outline" className="w-full">
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
