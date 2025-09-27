'use client';

import { useState, useEffect } from 'react';
import { getContentRatings, getRatingStatsByRole } from '@/lib/userRatings';

interface RatingStatsProps {
  contentId: string;
  contentTitle: string;
}

export function RatingStats({ contentId, contentTitle }: RatingStatsProps) {
  const [allRatings, setAllRatings] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [studentStats, setStudentStats] = useState<any>(null);

  useEffect(() => {
    const ratings = getContentRatings(contentId);
    setAllRatings(ratings);
    
    const adminStatsData = getRatingStatsByRole(contentId, 'admin');
    const studentStatsData = getRatingStatsByRole(contentId, 'student');
    
    setAdminStats(adminStatsData);
    setStudentStats(studentStatsData);
  }, [contentId]);

  if (allRatings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Puanlama İstatistikleri
        </h3>
        <p className="text-gray-500">Henüz puanlama yapılmamış.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {contentTitle} - Puanlama İstatistikleri
      </h3>
      
      <div className="space-y-4">
        {/* Genel İstatistikler */}
        <div className="border-b pb-4">
          <h4 className="font-medium text-gray-700 mb-2">Genel İstatistikler</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Toplam Puanlama:</span>
              <span className="ml-2 font-medium">{allRatings.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Ortalama Puan:</span>
              <span className="ml-2 font-medium">
                {(allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Admin İstatistikleri */}
        {adminStats && adminStats.count > 0 && (
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-700 mb-2">Admin Değerlendirmeleri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Admin Puanı:</span>
                <span className="ml-2 font-medium">{adminStats.average}/5</span>
              </div>
              <div>
                <span className="text-gray-600">Admin Sayısı:</span>
                <span className="ml-2 font-medium">{adminStats.count}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">{star}:</span>
                    <span className="text-sm font-medium">
                      {adminStats.distribution[star as keyof typeof adminStats.distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Öğrenci İstatistikleri */}
        {studentStats && studentStats.count > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Öğrenci Değerlendirmeleri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Öğrenci Puanı:</span>
                <span className="ml-2 font-medium">{studentStats.average}/5</span>
              </div>
              <div>
                <span className="text-gray-600">Öğrenci Sayısı:</span>
                <span className="ml-2 font-medium">{studentStats.count}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">{star}:</span>
                    <span className="text-sm font-medium">
                      {studentStats.distribution[star as keyof typeof studentStats.distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detaylı Puanlama Listesi */}
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Detaylı Puanlama Listesi</h4>
          <div className="max-h-40 overflow-y-auto">
            {allRatings.map((rating, index) => (
              <div key={index} className="flex justify-between items-center py-1 text-sm border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    {rating.userRole === 'admin' ? '👨‍💼 Admin' : '👨‍🎓 Öğrenci'}
                  </span>
                  <span className="text-gray-500">
                    {new Date(rating.timestamp).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
