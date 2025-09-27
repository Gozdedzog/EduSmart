'use client';

import { useState, useEffect } from 'react';
import { getAllCourses } from '@/lib/courseDatabase';

export default function DebugCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = () => {
      try {
        const allCourses = getAllCourses();
        setCourses(allCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error loading courses:', error);
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smart_learn_courses');
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Eğitimler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              📚 Eğitim Listesi Debug
            </h1>
            <button
              onClick={clearStorage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Storage'ı Temizle
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              Toplam <span className="font-bold text-blue-600">{courses.length}</span> eğitim bulundu
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz eğitim eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {index + 1}. {course.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{course.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tür:</span>
                      <p className="text-gray-600">
                        {course.type === 'VIDEO' ? '🎥 Video' : '📝 Yazılı İçerik'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Kategori:</span>
                      <p className="text-gray-600">{course.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Süre:</span>
                      <p className="text-gray-600">{course.duration} dakika</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Oluşturulma:</span>
                      <p className="text-gray-600">
                        {new Date(course.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="font-medium text-gray-700">İçerik:</span>
                    <p className="text-gray-600 break-all">
                      {course.content.length > 100 
                        ? `${course.content.substring(0, 100)}...` 
                        : course.content
                      }
                    </p>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    <p>ID: {course.id}</p>
                    <p>Author ID: {course.authorId}</p>
                    <p>Güncellenme: {new Date(course.updatedAt).toLocaleString('tr-TR')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Bilgi</h3>
            <p className="text-blue-800 text-sm">
              Bu sayfa localStorage'daki eğitimleri gösterir. Eğitimler admin panelinden eklenir ve 
              browser'ın localStorage'ında saklanır. Yeni eğitim eklemek için admin paneline gidin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
