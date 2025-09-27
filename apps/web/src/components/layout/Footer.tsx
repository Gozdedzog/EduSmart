'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold gradient-text">EduSmart</p>
                <p className="text-sm text-slate-400">Yapay Zekâ Destekli Öğrenme</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Yapay zekâ destekli kişiselleştirilmiş öğrenme deneyimi ile becerilerinizi geliştirin.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Erişim</h3>
            <div className="space-y-2">
              <Link 
                href="/icerikler" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Eğitimler
              </Link>
              <Link 
                href="/testler" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Testler
              </Link>
              <Link 
                href="/dashboard" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/hakkinda" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Hakkında
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Yasal</h3>
            <div className="space-y-2">
              <Link 
                href="/gizlilik" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Gizlilik Politikası
              </Link>
              <Link 
                href="/kullanim-kosullari" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Kullanım Koşulları
              </Link>
              <Link 
                href="/cerez-politikasi" 
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              © 2025 Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6">
              <p className="text-sm text-slate-400">
                Yapay zekâ ile öğrenme deneyiminizi kişiselleştirin
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
