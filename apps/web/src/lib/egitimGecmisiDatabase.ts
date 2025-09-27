// Eğitim geçmişi veritabanı fonksiyonları

export interface EgitimGecmisi {
  id: string;
  userId: string;
  contentId: string;
  contentTitle: string;
  contentType: 'VIDEO' | 'ARTICLE';
  category: string;
  completedAt: string;
  score?: number;
  timeSpent?: number; // dakika cinsinden
  rating?: number; // 1-5 arası puan
}

// API'den eğitim geçmişini getir
export async function getAllEgitimGecmisi(): Promise<EgitimGecmisi[]> {
  try {
    const response = await fetch('/api/egitim-gecmisi');
    const data = await response.json();
    return data.egitimGecmisi || [];
  } catch (error) {
    console.error('Error fetching egitim geçmişi:', error);
    return [];
  }
}

// Kullanıcının eğitim geçmişini getir
export async function getUserEgitimGecmisi(userId: string): Promise<EgitimGecmisi[]> {
  try {
    const allGecmisi = await getAllEgitimGecmisi();
    return allGecmisi.filter(gecmis => gecmis.userId === userId);
  } catch (error) {
    console.error('Error fetching user egitim geçmişi:', error);
    return [];
  }
}

// Eğitim geçmişi ekle
export async function addEgitimGecmisi(gecmis: Omit<EgitimGecmisi, 'id'>): Promise<EgitimGecmisi> {
  try {
    const allGecmisi = await getAllEgitimGecmisi();
    const newGecmis: EgitimGecmisi = {
      ...gecmis,
      id: Date.now().toString()
    };
    
    allGecmisi.push(newGecmis);
    
    // JSON dosyasına kaydet
    const response = await fetch('/api/egitim-gecmisi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ egitimGecmisi: allGecmisi }),
    });
    
    if (response.ok) {
      console.log('Eğitim geçmişi kaydedildi:', newGecmis.contentTitle);
    } else {
      console.error('Eğitim geçmişi kaydedilemedi');
    }
    
    return newGecmis;
  } catch (error) {
    console.error('Error adding egitim geçmişi:', error);
    throw error;
  }
}

// Eğitim geçmişi güncelle
export async function updateEgitimGecmisi(id: string, updates: Partial<EgitimGecmisi>): Promise<EgitimGecmisi | null> {
  try {
    const allGecmisi = await getAllEgitimGecmisi();
    const index = allGecmisi.findIndex(gecmis => gecmis.id === id);
    
    if (index === -1) {
      return null;
    }
    
    allGecmisi[index] = { ...allGecmisi[index], ...updates };
    
    // JSON dosyasına kaydet
    const response = await fetch('/api/egitim-gecmisi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ egitimGecmisi: allGecmisi }),
    });
    
    if (response.ok) {
      console.log('Eğitim geçmişi güncellendi:', allGecmisi[index].contentTitle);
    } else {
      console.error('Eğitim geçmişi güncellenemedi');
    }
    
    return allGecmisi[index];
  } catch (error) {
    console.error('Error updating egitim geçmişi:', error);
    throw error;
  }
}

// Eğitim geçmişi sil
export async function deleteEgitimGecmisi(id: string): Promise<boolean> {
  try {
    const allGecmisi = await getAllEgitimGecmisi();
    const filteredGecmisi = allGecmisi.filter(gecmis => gecmis.id !== id);
    
    // JSON dosyasına kaydet
    const response = await fetch('/api/egitim-gecmisi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ egitimGecmisi: filteredGecmisi }),
    });
    
    if (response.ok) {
      console.log('Eğitim geçmişi silindi:', id);
      return true;
    } else {
      console.error('Eğitim geçmişi silinemedi');
      return false;
    }
  } catch (error) {
    console.error('Error deleting egitim geçmişi:', error);
    return false;
  }
}

// Kullanıcının belirli bir içeriği tamamlayıp tamamlamadığını kontrol et
export async function isContentCompleted(userId: string, contentId: string): Promise<boolean> {
  try {
    const userGecmisi = await getUserEgitimGecmisi(userId);
    return userGecmisi.some(gecmis => gecmis.contentId === contentId);
  } catch (error) {
    console.error('Error checking content completion:', error);
    return false;
  }
}

// Kullanıcının tamamladığı içerik sayısını getir
export async function getCompletedContentCount(userId: string): Promise<number> {
  try {
    const userGecmisi = await getUserEgitimGecmisi(userId);
    return userGecmisi.length;
  } catch (error) {
    console.error('Error getting completed content count:', error);
    return 0;
  }
}

// Kullanıcının ortalama başarı puanını getir
export async function getUserAverageScore(userId: string): Promise<number> {
  try {
    const userGecmisi = await getUserEgitimGecmisi(userId);
    const scoredGecmisi = userGecmisi.filter(gecmis => gecmis.score !== undefined && gecmis.score > 0);
    
    if (scoredGecmisi.length === 0) {
      return 0;
    }
    
    const totalScore = scoredGecmisi.reduce((sum, gecmis) => sum + (gecmis.score || 0), 0);
    return Math.round(totalScore / scoredGecmisi.length);
  } catch (error) {
    console.error('Error getting user average score:', error);
    return 0;
  }
}

// Kullanıcının toplam harcadığı süreyi getir (dakika)
export async function getUserTotalTimeSpent(userId: string): Promise<number> {
  try {
    const userGecmisi = await getUserEgitimGecmisi(userId);
    return userGecmisi.reduce((total, gecmis) => total + (gecmis.timeSpent || 0), 0);
  } catch (error) {
    console.error('Error getting user total time spent:', error);
    return 0;
  }
}
