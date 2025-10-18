// Kullanıcı bazlı puanlama sistemi
import { 
  readJsonFile, 
  writeJsonFile, 
  updateJsonArray, 
  getAllFromJsonArray, 
  findInJsonArray,
  initializeJsonFile 
} from './jsonDatabase';

export interface UserRating {
  id: string;
  userId: string;
  contentId: string;
  rating: number;
  timestamp: string;
  userRole: 'admin' | 'student';
}

// Kullanıcının belirli bir içerik için puanını al
export function getUserRating(userId: string, contentId: string): number | null {
  try {
    // Önce JSON dosyasını başlat
    initializeJsonFile('userRatings', { puanlar: [] });
    
    const ratings = getAllFromJsonArray<UserRating>('userRatings', 'puanlar');
    const userRating = ratings.find(
      r => r.userId === userId && r.contentId === contentId
    );

    return userRating ? userRating.rating : null;
  } catch (error) {
    console.error('Error getting user rating:', error);
    return null;
  }
}

// Kullanıcının belirli bir içerik için puanını kaydet
export function saveUserRating(
  userId: string, 
  contentId: string, 
  rating: number, 
  userRole: 'admin' | 'student'
): void {
  try {
    const newRating: UserRating = {
      id: `${userId}-${contentId}-${Date.now()}`,
      userId,
      contentId,
      rating,
      timestamp: new Date().toISOString(),
      userRole
    };

    updateJsonArray('userRatings', newRating, 'puanlar');
  } catch (error) {
    console.error('Error saving user rating:', error);
  }
}

// Kullanıcının tüm puanlarını al
export function getUserRatings(userId: string): UserRating[] {
  try {
    return findInJsonArray<UserRating>('userRatings', 'puanlar', r => r.userId === userId);
  } catch (error) {
    console.error('Error getting user ratings:', error);
    return [];
  }
}

// Belirli bir içerik için tüm puanları al (admin için)
export function getContentRatings(contentId: string): UserRating[] {
  try {
    return findInJsonArray<UserRating>('userRatings', 'puanlar', r => r.contentId === contentId);
  } catch (error) {
    console.error('Error getting content ratings:', error);
    return [];
  }
}

// Kullanıcının puanını sil
export function deleteUserRating(userId: string, contentId: string): void {
  try {
    const ratings = getAllFromJsonArray<UserRating>('userRatings', 'puanlar');
    const filteredRatings = ratings.filter(
      r => !(r.userId === userId && r.contentId === contentId)
    );
    
    writeJsonFile('userRatings', { puanlar: filteredRatings });
  } catch (error) {
    console.error('Error deleting user rating:', error);
  }
}

// İçerik için ortalama puanı hesapla
export function getAverageRating(contentId: string): number {
  const ratings = getContentRatings(contentId);
  if (ratings.length === 0) return 0;

  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // 1 ondalık basamak
}

// Kullanıcı rolüne göre puanlama istatistikleri
export function getRatingStatsByRole(contentId: string, role: 'admin' | 'student') {
  const ratings = getContentRatings(contentId).filter(r => r.userRole === role);
  
  if (ratings.length === 0) {
    return {
      count: 0,
      average: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const average = Math.round((sum / ratings.length) * 10) / 10;

  const distribution = ratings.reduce((acc, rating) => {
    acc[rating.rating as keyof typeof acc]++;
    return acc;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  return {
    count: ratings.length,
    average,
    distribution
  };
}
