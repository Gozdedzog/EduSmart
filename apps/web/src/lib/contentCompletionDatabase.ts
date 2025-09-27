// İçerik tamamlama durumunu takip eden veritabanı
import { 
  readJsonFile, 
  writeJsonFile, 
  updateJsonArray, 
  getAllFromJsonArray, 
  findInJsonArray,
  initializeJsonFile 
} from './jsonDatabase';

export interface ContentCompletion {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'VIDEO' | 'ARTICLE' | 'AUDIO';
  isCompleted: boolean;
  completedAt?: string;
  progressPercentage: number; // 0-100 arası
  timeSpent: number; // dakika cinsinden
  lastAccessedAt: string;
}

// JSON dosyasından tamamlama verilerini yükle
const loadCompletions = (): ContentCompletion[] => {
  try {
    // Önce JSON dosyasını başlat
    initializeJsonFile('contentCompletions', { tamamlamalar: [] });
    
    const data = readJsonFile<{ tamamlamalar: ContentCompletion[] }>('contentCompletions');
    return data?.tamamlamalar || [];
  } catch (error) {
    console.error('Error loading content completions:', error);
    return [];
  }
};

// JSON dosyasına tamamlama verilerini kaydet
const saveCompletions = (completions: ContentCompletion[]): boolean => {
  try {
    return writeJsonFile('contentCompletions', { tamamlamalar: completions });
  } catch (error) {
    console.error('Error saving content completions:', error);
    return false;
  }
};

// Kullanıcının içerik tamamlama durumunu kontrol et
export const isContentCompleted = (userId: string, contentId: string): boolean => {
  const completions = loadCompletions();
  const completion = completions.find(
    c => c.userId === userId && c.contentId === contentId && c.isCompleted
  );
  return !!completion;
};

// Kullanıcının içerik ilerlemesini getir
export const getContentProgress = (userId: string, contentId: string): ContentCompletion | null => {
  const completions = loadCompletions();
  return completions.find(
    c => c.userId === userId && c.contentId === contentId
  ) || null;
};

// İçerik tamamlama durumunu güncelle
export const updateContentCompletion = (
  userId: string,
  contentId: string,
  contentType: 'VIDEO' | 'ARTICLE' | 'AUDIO',
  progressPercentage: number,
  timeSpent: number = 0
): ContentCompletion => {
  const completions = loadCompletions();
  const existingIndex = completions.findIndex(
    c => c.userId === userId && c.contentId === contentId
  );

  const now = new Date().toISOString();
  const isCompleted = progressPercentage >= 100;

  const completionData: ContentCompletion = {
    id: existingIndex >= 0 ? completions[existingIndex].id : Date.now().toString(),
    userId,
    contentId,
    contentType,
    isCompleted,
    completedAt: isCompleted ? now : undefined,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    timeSpent,
    lastAccessedAt: now,
  };

  if (existingIndex >= 0) {
    completions[existingIndex] = completionData;
  } else {
    completions.push(completionData);
  }

  saveCompletions(completions);
  return completionData;
};

// İçeriği tamamlandı olarak işaretle
export const markContentAsCompleted = (
  userId: string,
  contentId: string,
  contentType: 'VIDEO' | 'ARTICLE' | 'AUDIO',
  timeSpent: number = 0
): ContentCompletion => {
  return updateContentCompletion(userId, contentId, contentType, 100, timeSpent);
};

// Kullanıcının tamamladığı tüm içerikleri getir
export const getCompletedContents = (userId: string): ContentCompletion[] => {
  const completions = loadCompletions();
  return completions.filter(c => c.userId === userId && c.isCompleted);
};

// Kullanıcının belirli bir içerik türündeki tamamlamalarını getir
export const getCompletedContentsByType = (
  userId: string,
  contentType: 'VIDEO' | 'ARTICLE' | 'AUDIO'
): ContentCompletion[] => {
  const completions = loadCompletions();
  return completions.filter(
    c => c.userId === userId && c.contentType === contentType && c.isCompleted
  );
};

// Test erişim kontrolü - kullanıcı ilgili içeriği tamamlamış mı?
export const canAccessTest = (userId: string, relatedContentId: string): boolean => {
  return isContentCompleted(userId, relatedContentId);
};

// Kullanıcının test erişim durumunu kontrol et
export const getTestAccessStatus = (userId: string, relatedContentId: string): {
  canAccess: boolean;
  progress?: ContentCompletion;
  message: string;
} => {
  const progress = getContentProgress(userId, relatedContentId);
  const canAccess = isContentCompleted(userId, relatedContentId);

  if (canAccess) {
    return {
      canAccess: true,
      progress,
      message: 'Teste erişebilirsiniz'
    };
  }

  if (progress) {
    return {
      canAccess: false,
      progress,
      message: `İçeriği %${progress.progressPercentage} tamamladınız. Teste erişmek için %100 tamamlamanız gerekiyor.`
    };
  }

  return {
    canAccess: false,
    message: 'Teste erişmek için önce ilgili içeriği tamamlamanız gerekiyor.'
  };
};

// Kullanıcının genel ilerleme istatistiklerini getir
export const getUserProgressStats = (userId: string): {
  totalContents: number;
  completedContents: number;
  totalTimeSpent: number;
  completionRate: number;
  byType: {
    VIDEO: { completed: number; total: number };
    ARTICLE: { completed: number; total: number };
    AUDIO: { completed: number; total: number };
  };
} => {
  const completions = loadCompletions();
  const userCompletions = completions.filter(c => c.userId === userId);
  
  const completed = userCompletions.filter(c => c.isCompleted);
  const totalTimeSpent = userCompletions.reduce((sum, c) => sum + c.timeSpent, 0);
  
  const byType = {
    VIDEO: { completed: 0, total: 0 },
    ARTICLE: { completed: 0, total: 0 },
    AUDIO: { completed: 0, total: 0 }
  };

  userCompletions.forEach(c => {
    byType[c.contentType].total++;
    if (c.isCompleted) {
      byType[c.contentType].completed++;
    }
  });

  const totalContents = userCompletions.length;
  const completedContents = completed.length;
  const completionRate = totalContents > 0 ? (completedContents / totalContents) * 100 : 0;

  return {
    totalContents,
    completedContents,
    totalTimeSpent,
    completionRate,
    byType
  };
};
