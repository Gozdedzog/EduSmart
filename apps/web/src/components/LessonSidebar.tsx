'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/lib/data';
import { useAuth } from '@/context/HybridAuthProvider';
import { getUserRating, saveUserRating } from '@/lib/userRatings';

interface LessonSidebarProps {
  course: Course;
}

export function LessonSidebar({ course }: LessonSidebarProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);

  // Kullanıcının mevcut puanını yükle
  useEffect(() => {
    if (user) {
      const rating = getUserRating(user.id, course.id);
      setUserRating(rating);
    }
  }, [user, course.id]);

  const handleStarClick = (rating: number) => {
    if (user) {
      // Kullanıcı bazlı puanlama sistemini kullan
      saveUserRating(user.id, course.id, rating, user.role);
      setUserRating(rating);
      console.log(`${user.role} kullanıcısı ${rating} yıldız verdi: ${course.title}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          İlerleme
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tamamlanma</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {user ? 'Bu içeriği değerlendir' : 'Giriş yaparak değerlendirin'}
        </h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              disabled={!user}
              className={`w-8 h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${
                !user ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  userRating && star <= userRating
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {user ? (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {userRating ? 'Değerlendirmeniz kaydedildi' : 'Değerlendirmek için yıldıza tıklayın'}
            </p>
            {userRating && (
              <p className="text-xs text-gray-500 mt-1">
                {user.role === 'admin' ? 'Admin değerlendirmesi' : 'Öğrenci değerlendirmesi'}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-2">
            Değerlendirme yapmak için giriş yapın
          </p>
        )}
      </div>

      {/* Course Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ders Bilgileri
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tür:</span>
            <span className="font-medium">{course.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durum:</span>
            <span className="font-medium">
              {course.progress === 100
                ? 'Tamamlandı'
                : course.progress > 0
                  ? 'Devam Ediyor'
                  : 'Başlanmadı'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
