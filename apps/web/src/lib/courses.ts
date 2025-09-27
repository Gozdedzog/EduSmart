// Eğitim veri yapısı ve yönetimi
export interface Course {
  id: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'ARTICLE' | 'AUDIO';
  category: string;
  tags: string[];
  content: string; // Video URL veya makale içeriği
  duration?: number; // Dakika cinsinden
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

// Örnek eğitimler
const courses: Course[] = [
  {
    id: '1',
    title: 'Trigonometriye Giriş',
    description: 'Temel trigonometrik fonksiyonlar ve uygulamaları',
    type: 'VIDEO',
    category: 'Matematik',
    tags: ['Matematik', 'Video', 'Trigonometri'],
    content: 'https://example.com/video1',
    duration: 45,
    difficulty: 'BEGINNER',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: '1',
  },
  {
    id: '2',
    title: 'İstatistiğe Başlangıç',
    description: 'Temel istatistik kavramları ve veri analizi',
    type: 'ARTICLE',
    category: 'Matematik',
    tags: ['Matematik', 'Makale', 'İstatistik'],
    content: 'İstatistik, veri toplama, analiz etme ve yorumlama bilimidir...',
    duration: 30,
    difficulty: 'INTERMEDIATE',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: '1',
  },
  {
    id: '3',
    title: 'Tarih Okuma Teknikleri',
    description: 'Etkili tarih öğrenme yöntemleri',
    type: 'VIDEO',
    category: 'Tarih',
    tags: ['Tarih', 'Video', 'Öğrenme Teknikleri'],
    content: 'https://example.com/video2',
    duration: 60,
    difficulty: 'BEGINNER',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: '1',
  },
  {
    id: '4',
    title: 'Fizik Problemleri',
    description: 'Klasik mekanik problem çözme teknikleri',
    type: 'ARTICLE',
    category: 'Fizik',
    tags: ['Fizik', 'Makale', 'Problem Çözme'],
    content: 'Fizik problemlerini çözerken dikkat edilmesi gereken temel noktalar...',
    duration: 40,
    difficulty: 'ADVANCED',
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: '1',
  },
];

export function getAllCourses(): Course[] {
  return courses;
}

export function getCourseById(id: string): Course | null {
  return courses.find(course => course.id === id) || null;
}

export function addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
  const newCourse: Course = {
    ...course,
    id: (courses.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  courses.push(newCourse);
  return newCourse;
}

export function updateCourse(id: string, updates: Partial<Omit<Course, 'id' | 'createdAt' | 'authorId'>>): Course | null {
  const courseIndex = courses.findIndex(course => course.id === id);
  if (courseIndex === -1) return null;
  
  courses[courseIndex] = {
    ...courses[courseIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return courses[courseIndex];
}

export function deleteCourse(id: string): boolean {
  try {
    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return false;
    
    courses.splice(courseIndex, 1);
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
}

export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(course => course.category === category);
}

export function getPublishedCourses(): Course[] {
  return courses.filter(course => course.isPublished);
}

export const COURSE_TYPES = [
  { value: 'VIDEO', label: 'Video' },
  { value: 'ARTICLE', label: 'Makale' },
  { value: 'AUDIO', label: 'Sesli İçerik' },
];

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

export const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: 'Başlangıç' },
  { value: 'INTERMEDIATE', label: 'Orta' },
  { value: 'ADVANCED', label: 'İleri' },
];
