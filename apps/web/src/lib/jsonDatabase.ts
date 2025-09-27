// JSON tabanlı veri yönetim sistemi (Client-side uyumlu)
// Client-side'da localStorage, server-side'da API kullanır

// JSON dosyasını oku
export const readJsonFile = <T>(fileKey: string): T | null => {
  try {
    // Client-side'da localStorage kullan
    if (typeof window !== 'undefined') {
      const storageKey = `smart-learn-${fileKey}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    }
    
    // Server-side'da null döndür (API'ler kullanılacak)
    return null;
  } catch (error) {
    console.error(`JSON dosyası okuma hatası (${fileKey}):`, error);
    return null;
  }
};

// JSON dosyasına yaz
export const writeJsonFile = <T>(fileKey: string, data: T): boolean => {
  try {
    // Client-side'da localStorage kullan
    if (typeof window !== 'undefined') {
      const storageKey = `smart-learn-${fileKey}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log(`💾 localStorage'a kaydedildi: ${storageKey}`);
      return true;
    }
    
    // Server-side'da false döndür (API'ler kullanılacak)
    return false;
  } catch (error) {
    console.error(`JSON dosyası yazma hatası (${fileKey}):`, error);
    return false;
  }
};

// JSON dosyasını güncelle (array için)
export const updateJsonArray = <T extends { id: string }>(
  fileKey: string,
  newItem: T,
  arrayKey: string
): boolean => {
  try {
    const data = readJsonFile<any>(fileKey);
    if (!data) {
      // Yeni data oluştur
      const newData = { [arrayKey]: [newItem] };
      return writeJsonFile(fileKey, newData);
    }
    
    if (!data[arrayKey]) {
      data[arrayKey] = [];
    }
    
    const existingIndex = data[arrayKey].findIndex((item: T) => item.id === newItem.id);
    
    if (existingIndex >= 0) {
      data[arrayKey][existingIndex] = { ...data[arrayKey][existingIndex], ...newItem };
    } else {
      data[arrayKey].push(newItem);
    }
    
    return writeJsonFile(fileKey, data);
  } catch (error) {
    console.error(`JSON array güncelleme hatası (${fileKey}):`, error);
    return false;
  }
};

// JSON dosyasından item sil
export const deleteFromJsonArray = <T extends { id: string }>(
  fileKey: string,
  itemId: string,
  arrayKey: string
): boolean => {
  try {
    const data = readJsonFile<any>(fileKey);
    if (!data || !data[arrayKey]) return false;
    
    data[arrayKey] = data[arrayKey].filter((item: T) => item.id !== itemId);
    return writeJsonFile(fileKey, data);
  } catch (error) {
    console.error(`JSON array silme hatası (${fileKey}):`, error);
    return false;
  }
};

// JSON dosyasından item getir
export const getFromJsonArray = <T extends { id: string }>(
  fileKey: string,
  itemId: string,
  arrayKey: string
): T | null => {
  try {
    const data = readJsonFile<any>(fileKey);
    if (!data || !data[arrayKey]) return null;
    
    return data[arrayKey].find((item: T) => item.id === itemId) || null;
  } catch (error) {
    console.error(`JSON array okuma hatası (${fileKey}):`, error);
    return null;
  }
};

// JSON dosyasından tüm array'i getir
export const getAllFromJsonArray = <T>(
  fileKey: string,
  arrayKey: string
): T[] => {
  try {
    const data = readJsonFile<any>(fileKey);
    if (!data || !data[arrayKey]) return [];
    
    return data[arrayKey] as T[];
  } catch (error) {
    console.error(`JSON array okuma hatası (${fileKey}):`, error);
    return [];
  }
};

// JSON dosyasına filtreleme ile arama
export const findInJsonArray = <T>(
  fileKey: string,
  arrayKey: string,
  predicate: (item: T) => boolean
): T[] => {
  try {
    const data = readJsonFile<any>(fileKey);
    if (!data || !data[arrayKey]) return [];
    
    return data[arrayKey].filter(predicate) as T[];
  } catch (error) {
    console.error(`JSON array arama hatası (${fileKey}):`, error);
    return [];
  }
};

// JSON dosyasını temizle
export const clearJsonFile = (fileKey: string, arrayKey: string): boolean => {
  try {
    const data = readJsonFile<any>(fileKey) || {};
    data[arrayKey] = [];
    return writeJsonFile(fileKey, data);
  } catch (error) {
    console.error(`JSON dosyası temizleme hatası (${fileKey}):`, error);
    return false;
  }
};

// JSON dosyası oluştur (eğer yoksa)
export const initializeJsonFile = (fileKey: string, initialData: any): boolean => {
  try {
    const existingData = readJsonFile(fileKey);
    if (existingData === null) {
      return writeJsonFile(fileKey, initialData);
    }
    return true;
  } catch (error) {
    console.error(`JSON dosyası oluşturma hatası (${fileKey}):`, error);
    return false;
  }
};