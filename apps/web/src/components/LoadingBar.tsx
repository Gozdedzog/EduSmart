'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // NProgress still needs its CSS

export function LoadingBar() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // Next.js 13+ App Router does not have router.events.
    // We manually trigger NProgress on pathname change.
    // A more robust solution might involve intercepting fetch requests or using a custom router provider.
    
    // For demonstration, we'll start NProgress on component mount
    // and ensure it's done when the route is fully loaded.
    NProgress.start();
    return () => {
      NProgress.done();
    };

  }, [pathname]); // pathname değiştiğinde NProgress'i yeniden başlat

  return null; // This component doesn't render anything visible directly
} 