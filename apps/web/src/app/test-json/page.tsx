'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getAllFromJsonArray, 
  writeJsonFile, 
  readJsonFile,
  clearJsonFile 
} from '@/lib/jsonDatabase';
import { ContentCompletion } from '@/lib/contentCompletionDatabase';
import { UserRating } from '@/lib/userRatings';

export default function TestJsonPage() {
  const [completions, setCompletions] = useState<ContentCompletion[]>([]);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const completionsData = getAllFromJsonArray<ContentCompletion>('contentCompletions', 'tamamlamalar');
      const ratingsData = getAllFromJsonArray<UserRating>('userRatings', 'puanlar');
      
      setCompletions(completionsData);
      setRatings(ratingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const addTestData = () => {
    try {
      // Test içerik tamamlama verisi ekle
      const testCompletion: ContentCompletion = {
        id: Date.now().toString(),
        userId: 'test-user',
        contentId: 'test-content',
        contentType: 'VIDEO',
        isCompleted: true,
        completedAt: new Date().toISOString(),
        progressPercentage: 100,
        timeSpent: 10,
        lastAccessedAt: new Date().toISOString()
      };

      const testRating: UserRating = {
        userId: 'test-user',
        contentId: 'test-content',
        rating: 5,
        timestamp: new Date().toISOString(),
        userRole: 'student'
      };

      // Mevcut verileri al ve yeni veriyi ekle
      const currentCompletions = getAllFromJsonArray<ContentCompletion>('contentCompletions', 'tamamlamalar');
      const currentRatings = getAllFromJsonArray<UserRating>('userRatings', 'puanlar');

      const newCompletions = [...currentCompletions, testCompletion];
      const newRatings = [...currentRatings, testRating];

      // JSON dosyalarına kaydet
      writeJsonFile('contentCompletions', { tamamlamalar: newCompletions });
      writeJsonFile('userRatings', { puanlar: newRatings });

      // UI'yi güncelle
      loadData();
      
      alert('Test verisi eklendi!');
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('Test verisi eklenirken hata oluştu!');
    }
  };

  const clearAllData = () => {
    if (confirm('Tüm verileri silmek istediğinizden emin misiniz?')) {
      try {
        clearJsonFile('contentCompletions', 'tamamlamalar');
        clearJsonFile('userRatings', 'puanlar');
        loadData();
        alert('Tüm veriler silindi!');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Veriler silinirken hata oluştu!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="h-14" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-14" />
      
      <Section>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JSON Veritabanı Test Sayfası
          </h1>
          <p className="text-lg text-gray-600">
            JSON dosyalarında saklanan verileri test edin ve yönetin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* İçerik Tamamlama Verileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>İçerik Tamamlama Verileri</span>
                <span className="text-sm font-normal text-gray-500">
                  {completions.length} kayıt
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completions.length === 0 ? (
                <p className="text-gray-500">Henüz veri yok</p>
              ) : (
                <div className="space-y-2">
                  {completions.slice(0, 5).map((completion) => (
                    <div key={completion.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">
                        {completion.contentId} - {completion.contentType}
                      </div>
                      <div className="text-xs text-gray-500">
                        Kullanıcı: {completion.userId} | 
                        İlerleme: %{completion.progressPercentage} | 
                        Süre: {completion.timeSpent}dk
                      </div>
                    </div>
                  ))}
                  {completions.length > 5 && (
                    <p className="text-xs text-gray-500">
                      ... ve {completions.length - 5} kayıt daha
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kullanıcı Puanlama Verileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Kullanıcı Puanlama Verileri</span>
                <span className="text-sm font-normal text-gray-500">
                  {ratings.length} kayıt
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ratings.length === 0 ? (
                <p className="text-gray-500">Henüz veri yok</p>
              ) : (
                <div className="space-y-2">
                  {ratings.slice(0, 5).map((rating, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">
                        {rating.contentId} - {rating.rating}⭐
                      </div>
                      <div className="text-xs text-gray-500">
                        Kullanıcı: {rating.userId} | 
                        Rol: {rating.userRole} | 
                        Tarih: {new Date(rating.timestamp).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  ))}
                  {ratings.length > 5 && (
                    <p className="text-xs text-gray-500">
                      ... ve {ratings.length - 5} kayıt daha
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Butonları */}
        <div className="flex gap-4">
          <Button onClick={addTestData} className="bg-blue-600 hover:bg-blue-700">
            Test Verisi Ekle
          </Button>
          <Button onClick={loadData} variant="outline">
            Verileri Yenile
          </Button>
          <Button onClick={clearAllData} variant="outline" className="text-red-600 hover:text-red-700">
            Tüm Verileri Sil
          </Button>
        </div>

        {/* JSON Dosya Durumu */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">JSON Dosya Durumu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800">icerik-tamamlama.json</h4>
              <p className="text-sm text-green-600">
                {completions.length} içerik tamamlama kaydı
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800">kullanici-puanlari.json</h4>
              <p className="text-sm text-blue-600">
                {ratings.length} kullanıcı puanlama kaydı
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
