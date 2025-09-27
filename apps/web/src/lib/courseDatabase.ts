// Kalıcı eğitim veri yapısı (localStorage tabanlı)
export interface Course {
  id: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'ARTICLE';
  category: string;
  content: string; // Video URL veya makale içeriği
  duration?: number; // Dakika cinsinden
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

const STORAGE_KEY = 'smart_learn_courses';

// localStorage'dan veri oku
function loadCoursesFromStorage(): Course[] {
  // Server-side rendering kontrolü
  if (typeof window === 'undefined') {
    // Server-side'da varsayılan eğitimleri döndür
    return getDefaultCourses();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const courses = JSON.parse(stored);
      console.log('Loaded courses from storage:', courses.length);
      return courses;
    } else {
      // Storage'da veri yoksa varsayılan eğitimleri yükle
      console.log('No courses in storage, loading default courses');
      const defaultCourses = getDefaultCourses();
      saveCoursesToStorage(defaultCourses);
      return defaultCourses;
    }
  } catch (error) {
    console.error('Error loading courses from storage:', error);
    return getDefaultCourses();
  }
}

// Varsayılan eğitimleri getir
export function getDefaultCourses(): Course[] {
  return [
    {
      id: '1',
      title: 'TEMEL KAVRAMLAR',
      description: 'Bu içerikte matematiğin temel kavramlarını öğrenecek, sayılar, işlemler, semboller ve temel kurallarla ilgili bilgilerinizi pekiştireceksiniz.',
      type: 'VIDEO',
      category: 'Matematik',
      content: 'https://www.youtube.com/watch?v=6K7SJHHDdpM',
      duration: 20,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'admin'
    },
    {
      id: '2',
      title: 'NOKTALAMA İŞARETLERİ',
      description: 'Bu videoyu izleyerek noktalama işaretleri konusundaki birçok önemli kavramı anlayacaksınız. Nokta, virgül, noktalı virgül, ünlem işareti, üç nokta, parantez, soru işareti, kısa ve uzun çizgi gibi birçok konuyu hızlı ve anlaşılır bir şekilde anlatmayı hedefledik.',
      type: 'VIDEO',
      category: 'Türkçe',
      content: 'https://www.youtube.com/watch?v=DedyiW2jRZs',
      duration: 15,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'admin'
    },
    {
      id: '3',
      title: 'NOKTALAMA İŞARETLERİ',
      description: 'Bu yazılı içerikte noktalama işaretlerinin kullanımını öğrenecek, cümlelerin doğru ve anlaşılır olmasını sağlayan temel kuralları keşfedeceksiniz.',
      type: 'ARTICLE',
      category: 'Türkçe',
      content: `# Noktalama İşaretleri Rehberi

## Nokta (.)
Nokta, cümlenin sonunda kullanılır.

**Örnekler:**
- Bugün hava çok güzel.
- Saat 14.30'da buluşalım.

## Virgül (,)
Virgül, cümle içinde kısa duraklamaları belirtmek için kullanılır.

**Kullanım Alanları:**
- Sıralı cümleleri ayırmak için
- Hitap sözlerinden sonra
- Eş görevli sözcükleri ayırmak için

## Noktalı Virgül (;)
Noktalı virgül, virgülden daha güçlü, noktadan daha zayıf bir duraklama işaretidir.

**Örnek:**
- Ali geldi; Mehmet gitmedi.

## Ünlem İşareti (!)
Ünlem işareti, sevinç, korku, şaşırma gibi duyguları belirtmek için kullanılır.

**Örnek:**
- Ne kadar güzel bir gün!

## Soru İşareti (?)
Soru işareti, soru cümlelerinin sonunda kullanılır.

**Örnek:**
- Nasılsın?

## Üç Nokta (...)
Üç nokta, eksik bırakılan kısımları belirtmek için kullanılır.

**Örnek:**
- Kitap, defter, kalem... hepsi masada.

## Parantez ()
Parantez, açıklama yapmak için kullanılır.

**Örnek:**
- Ahmet (en büyük oğlum) geldi.

## Tırnak İşareti ("")
Tırnak işareti, alıntı yaparken kullanılır.

**Örnek:**
- "Merhaba," dedi.`,
      duration: 25,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'admin'
    },
    {
      id: '4',
      title: 'TEMEL KAVRAMLAR',
      description: 'Bu yazılı içerikte matematiğin temel kavramlarını öğrenecek, sayılar, işlemler, semboller ve temel kurallarla ilgili bilgilerinizi pekiştireceksiniz.',
      type: 'ARTICLE',
      category: 'Matematik',
      content: `# Matematik Temel Kavramlar

## Sayı Sistemleri

### Doğal Sayılar
Doğal sayılar, sayma sayılarıdır: 1, 2, 3, 4, 5...

### Tam Sayılar
Tam sayılar, pozitif ve negatif sayıları içerir: ..., -2, -1, 0, 1, 2, ...

### Rasyonel Sayılar
Rasyonel sayılar, iki tam sayının oranı olarak yazılabilen sayılardır.

**Örnek:** 1/2, 3/4, -2/5

## Temel İşlemler

### Toplama (+)
- Değişme özelliği: a + b = b + a
- Birleşme özelliği: (a + b) + c = a + (b + c)

### Çıkarma (-)
- a - b = a + (-b)

### Çarpma (×)
- Değişme özelliği: a × b = b × a
- Birleşme özelliği: (a × b) × c = a × (b × c)

### Bölme (÷)
- a ÷ b = a × (1/b)

## Cebirsel İfadeler

### Değişkenler
Değişkenler, bilinmeyen değerleri temsil eden harflerdir.

**Örnek:** x, y, z

### Katsayılar
Katsayılar, değişkenlerin önündeki sayılardır.

**Örnek:** 3x'te 3 katsayıdır.

## Geometri Temelleri

### Açılar
- Dar açı: 0° < α < 90°
- Dik açı: α = 90°
- Geniş açı: 90° < α < 180°

### Üçgenler
- Eşkenar üçgen: Tüm kenarları eşit
- İkizkenar üçgen: İki kenarı eşit
- Çeşitkenar üçgen: Tüm kenarları farklı

## İstatistik Temelleri

### Merkezi Eğilim Ölçüleri
- **Aritmetik ortalama:** Tüm değerlerin toplamının sayıya bölümü
- **Medyan:** Sıralı veri setinin ortasındaki değer
- **Mod:** En çok tekrar eden değer

### Dağılım Ölçüleri
- **Aralık:** En büyük değer - En küçük değer
- **Standart sapma:** Verilerin ortalamadan ne kadar uzaklaştığını gösterir`,
      duration: 30,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'admin'
    }
  ];
}

// localStorage'a veri yaz
function saveCoursesToStorage(courses: Course[]): void {
  // Server-side rendering kontrolü
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    // Custom event dispatch for same-tab updates
    console.log('Dispatching coursesUpdated event, courses count:', courses.length);
    window.dispatchEvent(new CustomEvent('coursesUpdated'));
    
    // Storage event dispatch for cross-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(courses),
      oldValue: localStorage.getItem(STORAGE_KEY),
      storageArea: localStorage,
      url: window.location.href
    }));
  } catch (error) {
    console.error('Error saving courses to storage:', error);
  }
}

// Tüm eğitimleri getir
export function getAllCourses(): Course[] {
  return loadCoursesFromStorage();
}

// ID'ye göre eğitim getir
export function getCourseById(id: string): Course | null {
  const courses = loadCoursesFromStorage();
  return courses.find(course => course.id === id) || null;
}

// Yeni eğitim ekle
export function addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
  const courses = loadCoursesFromStorage();
  const newCourse: Course = {
    ...course,
    id: Date.now().toString(), // Basit ID oluşturma
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  courses.push(newCourse);
  saveCoursesToStorage(courses);
  return newCourse;
}

// Eğitim güncelle
export function updateCourse(id: string, updates: Partial<Omit<Course, 'id' | 'createdAt' | 'authorId'>>): Course | null {
  console.log('updateCourse called with ID:', id, 'updates:', updates);
  
  const courses = loadCoursesFromStorage();
  console.log('Loaded courses for update:', courses.length);
  
  const courseIndex = courses.findIndex(course => course.id === id);
  console.log('Course index found:', courseIndex);
  
  if (courseIndex === -1) {
    console.error('Course not found with ID:', id);
    return null;
  }
  
  console.log('Before update:', courses[courseIndex]);
  
  courses[courseIndex] = {
    ...courses[courseIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  console.log('After update:', courses[courseIndex]);
  
  console.log('Saving courses to storage...');
  saveCoursesToStorage(courses);
  console.log('Courses saved to storage successfully');
  
  return courses[courseIndex];
}

// Eğitim sil
export function deleteCourse(id: string): boolean {
  const courses = loadCoursesFromStorage();
  const courseIndex = courses.findIndex(course => course.id === id);
  
  if (courseIndex === -1) return false;
  
  courses.splice(courseIndex, 1);
  saveCoursesToStorage(courses);
  return true;
}

// Kategoriye göre eğitimleri getir
export function getCoursesByCategory(category: string): Course[] {
  const courses = loadCoursesFromStorage();
  return courses.filter(course => course.category === category);
}

// Yayınlanmış eğitimleri getir
export function getPublishedCourses(): Course[] {
  const courses = loadCoursesFromStorage();
  return courses.filter(course => course.isPublished);
}

// Eğitim türleri
export const COURSE_TYPES = [
  { value: 'VIDEO', label: 'Videolu İçerik' },
  { value: 'ARTICLE', label: 'Yazılı İçerik' },
];

// Eğitim kategorileri
export const COURSE_CATEGORIES = [
  'Matematik',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Tarih',
  'Coğrafya',
  'Türkçe',
  'İngilizce',
  'Felsefe',
  'Bilgisayar',
];


