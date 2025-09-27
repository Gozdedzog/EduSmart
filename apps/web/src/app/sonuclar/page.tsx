'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Award, CheckCircle, XCircle, Clock, ArrowLeft, TrendingUp } from "lucide-react";
import { useAuth } from '@/context/HybridAuthProvider';
import { getUserTestSonuclari, getUserTestStats } from '@/lib/testSonuclariDatabase';
import { useRouter } from 'next/navigation';

interface TestResult {
  testId: string;
  testTitle: string;
  category: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  duration: number;
  completedAt: string;
  timeSpent: number; // saniye cinsinden
  userId: string; // Kullanıcı ID'si eklendi
  testType?: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'EXAM';
}

interface Test {
  id: string;
  title: string;
  category: string;
  questionCount: number;
  duration: number;
}

export default function SonuclarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Test sonuçlarını yükle
  useEffect(() => {
    const loadTestResults = async () => {
      if (!user) return;
      
      try {
        // JSON dosyasından test sonuçlarını al
        const userResults = await getUserTestSonuclari(user.id);
        setTestResults(userResults);
        console.log('Test sonuçları yüklendi:', userResults.length, 'kayıt');
      } catch (error) {
        console.error('Error loading test results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTestResults();
  }, [user]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-blue-50';
    if (score >= 50) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getCategoryColor = (category: string) => {
    return category === 'Türkçe' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
  };

  // İstatistikleri hesapla
  const totalTests = testResults?.length || 0;
  const averageScore = totalTests > 0 ? Math.round((testResults || []).reduce((sum, result) => sum + result.score, 0) / totalTests) : 0;
  const totalCorrectAnswers = (testResults || []).reduce((sum, result) => sum + result.correctAnswers, 0);
  const totalWrongAnswers = (testResults || []).reduce((sum, result) => sum + result.wrongAnswers, 0);
  const totalTimeSpent = (testResults || []).reduce((sum, result) => sum + result.timeSpent, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login?next=' + encodeURIComponent('/sonuclar'));
    return null;
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
          <span className="text-gray-900 font-medium">Sonuçlarım</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Sonuçlarım
          </h1>
          <p className="text-lg text-gray-600">
            Tüm test sonuçlarınızı buradan görüntüleyebilir ve performansınızı takip edebilirsiniz.
          </p>
        </div>


        {/* Genel İstatistikler */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
                    <p className="text-sm text-gray-600">Toplam Test</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalCorrectAnswers}</p>
                    <p className="text-sm text-gray-600">Doğru Cevap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalWrongAnswers}</p>
                    <p className="text-sm text-gray-600">Yanlış Cevap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                    <p className="text-sm text-gray-600">Ortalama Başarı</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Sonuçları Listesi */}
        {testResults.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Detayları</h2>
            {testResults.map((result, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {result.testTitle}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                          {result.category}
                        </span>
                        {result.testType && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            result.testType === 'VIDEO' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {result.testType === 'VIDEO' ? '📹 Videolu İçerik' : '📝 Yazılı İçerik'}
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(result.timeSpent)}</span>
                        </span>
                        <span>{formatDate(result.completedAt)}</span>
                      </div>
                    </div>
                    
                    <div className={`px-4 py-2 rounded-lg ${getScoreBgColor(result.score)}`}>
                      <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Doğru Cevap</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                      <div className="text-sm text-green-600">/{result.totalQuestions} soru</div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">Yanlış Cevap</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">{result.wrongAnswers}</div>
                      <div className="text-sm text-red-600">/{result.totalQuestions} soru</div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Süre</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{formatTime(result.timeSpent)}</div>
                      <div className="text-sm text-blue-600">/{formatTime(result.duration * 60)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Test Sonucu Yok</h3>
            <p className="text-gray-600 mb-6">Test çözmeye başlayarak sonuçlarınızı burada görebilirsiniz.</p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => router.push('/test')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Test Çözmeye Başla
              </Button>
              <Button 
                onClick={() => {
                  // localStorage'ı temizle
                  localStorage.removeItem('testResults');
                  setTestResults([]);
                }}
                variant="outline"
              >
                Sonuçları Temizle
              </Button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}