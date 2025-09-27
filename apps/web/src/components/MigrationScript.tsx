'use client';

import { useEffect } from 'react';
import { autoMigrate } from '@/lib/migrateToJson';

export function MigrationScript() {
  useEffect(() => {
    // Sayfa yüklendiğinde otomatik migration çalıştır
    autoMigrate();
  }, []);

  // Bu bileşen görünmez, sadece migration işlemini çalıştırır
  return null;
}
