// Test sonuçları veritabanı (JSON dosyası tabanlı)
export interface TestSonucu {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  category: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  duration: number;
  timeSpent: number;
  completedAt: string;
  testType: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'EXAM';
}

import { 
  readJsonFile, 
  writeJsonFile, 
  updateJsonArray, 
  getAllFromJsonArray, 
  findInJsonArray,
  initializeJsonFile 
} from './jsonDatabase';

// Test sonuçlarını yükle (API üzerinden)
async function loadTestSonuclari(): Promise<TestSonucu[]> {
  try {
    const response = await fetch('/api/test-sonuclari');
    if (!response.ok) {
      throw new Error('API hatası');
    }
    const data = await response.json();
    console.log('📂 Test sonuçları yüklendi:', data?.sonuclar?.length || 0, 'kayıt');
    return data?.sonuclar || [];
  } catch (error) {
    console.error('Test sonuçları yükleme hatası:', error);
    return [];
  }
}

// Test sonucu kaydet (API üzerinden)
async function saveTestSonuclari(sonuclar: TestSonucu[]): Promise<boolean> {
  try {
    const response = await fetch('/api/test-sonuclari', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sonuclar }),
    });
    
    if (!response.ok) {
      throw new Error('API hatası');
    }
    
    console.log('💾 Test sonuçları kaydedildi:', sonuclar.length, 'kayıt');
    return true;
  } catch (error) {
    console.error('Test sonuçları kaydetme hatası:', error);
    return false;
  }
}

// Yeni test sonucu ekle
export const addTestSonucu = async (sonuc: Omit<TestSonucu, 'id'>): Promise<TestSonucu> => {
  console.log('🔧 addTestSonucu çağrıldı:', sonuc);
  
  try {
    const response = await fetch('/api/test-sonuclari', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sonuc),
    });
    
    if (!response.ok) {
      throw new Error('API hatası');
    }
    
    const result = await response.json();
    console.log('✅ Yeni sonuç eklendi:', result.sonuc);
    return result.sonuc;
  } catch (error) {
    console.error('Test sonucu ekleme hatası:', error);
    throw error;
  }
};

// Kullanıcının test sonuçlarını getir
export const getUserTestSonuclari = async (userId: string): Promise<TestSonucu[]> => {
  try {
    const response = await fetch(`/api/test-sonuclari?userId=${userId}`);
    if (!response.ok) {
      throw new Error('API hatası');
    }
    const data = await response.json();
    console.log('👤 Kullanıcı test sonuçları:', data.sonuclar?.length || 0, 'kayıt');
    return data.sonuclar || [];
  } catch (error) {
    console.error('Kullanıcı test sonuçları yükleme hatası:', error);
    return [];
  }
};

// Test sonucunu güncelle
export const updateTestSonucu = async (id: string, updates: Partial<TestSonucu>): Promise<boolean> => {
  const sonuclar = await loadTestSonuclari();
  const index = sonuclar.findIndex(sonuc => sonuc.id === id);
  
  if (index === -1) {
    return false;
  }
  
  sonuclar[index] = { ...sonuclar[index], ...updates };
  await saveTestSonuclari(sonuclar);
  return true;
};

// Test sonucunu sil
export const deleteTestSonucu = async (id: string): Promise<boolean> => {
  const sonuclar = await loadTestSonuclari();
  const filteredSonuclar = sonuclar.filter(sonuc => sonuc.id !== id);
  
  if (filteredSonuclar.length === sonuclar.length) {
    return false; // Sonuç bulunamadı
  }
  
  await saveTestSonuclari(filteredSonuclar);
  return true;
};

// Tüm test sonuçlarını getir
export const getAllTestSonuclari = async (): Promise<TestSonucu[]> => {
  return await loadTestSonuclari();
};

// Kullanıcının test istatistiklerini getir
export const getUserTestStats = async (userId: string) => {
  const sonuclar = await getUserTestSonuclari(userId);
  
  if (sonuclar.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalTimeSpent: 0,
      bestScore: 0,
      worstScore: 0
    };
  }
  
  const totalTests = sonuclar.length;
  const totalScore = sonuclar.reduce((sum, sonuc) => sum + sonuc.score, 0);
  const averageScore = Math.round(totalScore / totalTests);
  const totalCorrectAnswers = sonuclar.reduce((sum, sonuc) => sum + sonuc.correctAnswers, 0);
  const totalWrongAnswers = sonuclar.reduce((sum, sonuc) => sum + sonuc.wrongAnswers, 0);
  const totalTimeSpent = sonuclar.reduce((sum, sonuc) => sum + sonuc.timeSpent, 0);
  const bestScore = Math.max(...sonuclar.map(sonuc => sonuc.score));
  const worstScore = Math.min(...sonuclar.map(sonuc => sonuc.score));
  
  return {
    totalTests,
    averageScore,
    totalCorrectAnswers,
    totalWrongAnswers,
    totalTimeSpent,
    bestScore,
    worstScore
  };
};

// Kategori bazında istatistikler
export const getCategoryStats = async (userId: string) => {
  const sonuclar = await getUserTestSonuclari(userId);
  const categoryStats: { [key: string]: any } = {};
  
  sonuclar.forEach(sonuc => {
    if (!categoryStats[sonuc.category]) {
      categoryStats[sonuc.category] = {
        totalTests: 0,
        totalScore: 0,
        averageScore: 0,
        totalCorrectAnswers: 0,
        totalWrongAnswers: 0
      };
    }
    
    categoryStats[sonuc.category].totalTests++;
    categoryStats[sonuc.category].totalScore += sonuc.score;
    categoryStats[sonuc.category].totalCorrectAnswers += sonuc.correctAnswers;
    categoryStats[sonuc.category].totalWrongAnswers += sonuc.wrongAnswers;
  });
  
  // Ortalama skorları hesapla
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.averageScore = Math.round(stats.totalScore / stats.totalTests);
  });
  
  return categoryStats;
};
