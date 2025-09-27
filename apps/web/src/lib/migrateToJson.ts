// localStorage verilerini JSON dosyalarına taşıma scripti
import { writeJsonFile } from './jsonDatabase';

// Migration fonksiyonu
export const migrateLocalStorageToJson = (): void => {
  if (typeof window === 'undefined') {
    console.log('Migration sadece client-side çalışır');
    return;
  }

  console.log('🔄 localStorage verilerini JSON dosyalarına taşıma başlatılıyor...');

  try {
    // 1. İçerik tamamlama verilerini taşı
    const contentCompletions = localStorage.getItem('smart-learn-content-completions');
    if (contentCompletions) {
      const completions = JSON.parse(contentCompletions);
      writeJsonFile('contentCompletions', { tamamlamalar: completions });
      console.log('✅ İçerik tamamlama verileri taşındı:', completions.length, 'kayıt');
    }

    // 2. Kullanıcı puanlama verilerini taşı
    const userRatings = localStorage.getItem('smart_learn_user_ratings');
    if (userRatings) {
      const ratings = JSON.parse(userRatings);
      writeJsonFile('userRatings', { puanlar: ratings });
      console.log('✅ Kullanıcı puanlama verileri taşındı:', ratings.length, 'kayıt');
    }

    // 3. Test verilerini taşı
    const tests = localStorage.getItem('smart-learn-tests');
    if (tests) {
      const testData = JSON.parse(tests);
      writeJsonFile('tests', { testler: testData.testler || [] });
      console.log('✅ Test verileri taşındı:', testData.testler?.length || 0, 'kayıt');
    }

    // 4. Kullanıcı verilerini taşı
    const users = localStorage.getItem('smart_learn_users');
    if (users) {
      const userData = JSON.parse(users);
      writeJsonFile('users', { kullanicilar: userData });
      console.log('✅ Kullanıcı verileri taşındı:', userData.length, 'kayıt');
    }

    console.log('🎉 Tüm veriler başarıyla JSON dosyalarına taşındı!');
    
    // Migration tamamlandıktan sonra localStorage'ı temizle (isteğe bağlı)
    // clearLocalStorage();
    
  } catch (error) {
    console.error('❌ Migration sırasında hata oluştu:', error);
  }
};

// localStorage'ı temizle (isteğe bağlı)
export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') return;

  const keysToRemove = [
    'smart-learn-content-completions',
    'smart_learn_user_ratings',
    'smart-learn-tests',
    'smart_learn_users'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('🧹 localStorage temizlendi');
};

// Migration durumunu kontrol et
export const checkMigrationStatus = (): boolean => {
  if (typeof window === 'undefined') return false;

  const hasLocalStorageData = [
    'smart-learn-content-completions',
    'smart_learn_user_ratings',
    'smart-learn-tests',
    'smart_learn_users'
  ].some(key => localStorage.getItem(key) !== null);

  return hasLocalStorageData;
};

// Otomatik migration (sayfa yüklendiğinde)
export const autoMigrate = (): void => {
  if (checkMigrationStatus()) {
    console.log('🔄 localStorage verileri bulundu, migration başlatılıyor...');
    migrateLocalStorageToJson();
  } else {
    console.log('✅ Migration gerekli değil, tüm veriler zaten JSON dosyalarında');
  }
};
