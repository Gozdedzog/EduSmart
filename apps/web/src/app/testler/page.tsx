'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, PlayCircle, FileText, Clock, Award, Lock } from "lucide-react";
import { useAuth } from '@/context/HybridAuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { canAccessTest, getTestAccessStatus } from '@/lib/contentCompletionDatabase';

interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  relatedContentId: string;
  relatedContentTitle: string;
  questionCount: number;
  duration: number;
  difficulty: string;
  isPublished: boolean;
}

export default function TestlerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tüm Kategoriler');
  const [selectedType, setSelectedType] = useState<string>('Tüm Türler');
  const [isLoading, setIsLoading] = useState(true);

  // Test verilerini yükle
  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await fetch('/api/tests');
        const data = await response.json();
        const publishedTests = data.testler?.filter((test: Test) => test.isPublished) || [];
        setTests(publishedTests);
        setFilteredTests(publishedTests);
      } catch (error) {
        console.error('Error loading tests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTests();
  }, []);

  // Filtreleme
  useEffect(() => {
    let filtered = [...tests];

    if (selectedCategory !== 'Tüm Kategoriler') {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }

    if (selectedType !== 'Tüm Türler') {
      filtered = filtered.filter(test => {
        if (selectedType === 'Yazılı İçerik' && test.title.includes('(Yazılı)')) return true;
        if (selectedType === 'Videolu İçerik' && test.title.includes('(Video)')) return true;
        return false;
      });
    }

    setFilteredTests(filtered);
  }, [tests, selectedCategory, selectedType]);

  // Kategorileri al
  const categories = Array.from(new Set(tests.map(test => test.category)));

  const handleTestClick = (test: Test) => {
    if (loading) {
      return;
    }
    
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent('/testler')}`);
      return;
    }

    // İçerik tamamlama kontrolü
    const accessStatus = getTestAccessStatus(user.id, test.relatedContentId);
    if (!accessStatus.canAccess) {
      // Kullanıcıya uyarı göster
      const message = accessStatus.progress 
        ? `Teste erişmek için önce "${test.relatedContentTitle}" içeriğini tamamlamanız gerekiyor.\n\nMevcut ilerleme: %${accessStatus.progress.progressPercentage}\n\nİçeriği tamamlamak için içerikler sayfasına gidin.`
        : `Teste erişmek için önce "${test.relatedContentTitle}" içeriğini tamamlamanız gerekiyor.\n\nİçeriği tamamlamak için içerikler sayfasına gidin.`;
      
      if (confirm(message + '\n\nİçerikler sayfasına gitmek ister misiniz?')) {
        router.push('/icerikler');
      }
      return;
    }
    
    // Test sayfasına yönlendir
    router.push(`/test/${test.id}`);
  };

  const handleContentClick = (test: Test) => {
    if (loading) {
      return;
    }
    
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent('/testler')}`);
      return;
    }

    // İlgili içeriğe yönlendir
    router.push(`/icerikler?contentId=${test.relatedContentId}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-14" />
      
      <Section>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <a href="/dashboard" className="hover:text-gray-900 transition-colors">
            Dashboard
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Testler</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Çöz
          </h1>
          <p className="text-lg text-gray-600">
            Eğitim içeriklerinizi pekiştirmek için testleri çözün. Her test 30 sorudan oluşmaktadır.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tüm Kategoriler
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tüm Türler
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option>Tüm Türler</option>
                <option>Yazılı İçerik</option>
                <option>Videolu İçerik</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => {
            const accessStatus = user ? getTestAccessStatus(user.id, test.relatedContentId) : { canAccess: false, message: '' };
            const isLocked = !accessStatus.canAccess;
            
            return (
            <Card 
              key={test.id} 
              className={`border-none shadow-lg transition-all duration-200 flex flex-col h-full ${
                isLocked 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:shadow-xl cursor-pointer'
              }`}
              onClick={() => handleTestClick(test)}
            >
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="line-clamp-2">{test.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {test.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {test.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <PlayCircle className="w-3 h-3" />
                        <span>{test.questionCount} soru</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.duration} dk</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">İlgili İçerik:</span> {test.relatedContentTitle}
                    {accessStatus.progress && !accessStatus.canAccess && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>İlerleme</span>
                          <span>%{accessStatus.progress.progressPercentage}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${accessStatus.progress.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  {isLocked ? (
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContentClick(test);
                      }}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      İçeriği Tamamlayın
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestClick(test);
                      }}
                    >
                      Teste Başla
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {filteredTests.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Seçilen kriterlere uygun test bulunamadı.</p>
            <Button 
              onClick={() => {
                setSelectedCategory('Tüm Kategoriler');
                setSelectedType('Tüm Türler');
              }}
              variant="outline"
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
}