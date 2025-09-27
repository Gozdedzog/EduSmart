import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HybridAuthProvider } from '@/context/HybridAuthProvider';
import { LoadingBar } from '@/components/LoadingBar';
import { MigrationScript } from '@/components/MigrationScript';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu',
  description:
    'Yapay zekâ destekli kişiselleştirilmiş öğrenme deneyimi ile becerilerinizi geliştirin. İlerlemenizi takip edin, çeşitli içerikleri keşfedin ve öğrenme hedeflerinize ulaşın.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HybridAuthProvider>
          <MigrationScript />
          <LoadingBar />
          <Navbar />
          {/* removed legacy top panel */}
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </HybridAuthProvider>
      </body>
    </html>
  );
}
