'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/HybridAuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, BookOpen, Award, TrendingUp, PlayCircle, FileText, Clock, Target, BarChart3 } from "lucide-react";
import { getAllCourses } from '@/lib/fileCourseDatabase';
import { getUserEgitimGecmisi, getCompletedContentCount, getUserAverageScore, getUserTotalTimeSpent } from '@/lib/egitimGecmisiDatabase';
import ContentDisplayModal from '@/components/ContentDisplayModal';
import { getUserTestSonuclari } from '@/lib/testSonuclariDatabase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalContents: 0,
    completedContents: 0,
    averageScore: 0,
    totalTimeSpent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userLearningStyle, setUserLearningStyle] = useState<{
    style: string;
    confidence: number;
    recommendations: string[];
  } | null>(null);


  const handleCourseClick = (course: any) => {
    if (loading) {
      return;
    }
    
    if (!user) {
      window.location.href = '/auth/login?next=' + encodeURIComponent('/dashboard');
      return;
    }
    
    setSelectedCourse(course);
    setShowModal(true);
  };

  const loadUserLearningStyle = useCallback(async () => {
    try {
      if (user) {
        // Kullanıcının test sonuçlarını al
        const testResults = await getUserTestSonuclari(user.id);
        console.log('🔍 Test sonuçları:', testResults);
        
        // Video ve yazılı test sonuçlarını bul
        const videoTest = testResults.find(result => 
          result.testType === 'VIDEO'
        );
        const textTest = testResults.find(result => 
          result.testType === 'ARTICLE'
        );
        
        console.log('📹 Video test:', videoTest);
        console.log('📝 Yazılı test:', textTest);
        console.log('👤 Kullanıcı bilgileri:', { age: user.age, gender: user.gender });
        
        // Her iki test de tamamlanmışsa öğrenme stilini belirle
        if (videoTest && textTest) {
          const videoScore = videoTest.score;
          const textScore = textTest.score;
          
          // ML modeli için yaş ve cinsiyet bilgilerini kullan
          const userAge = user.age || 20; // Varsayılan yaş
          const userGender = user.gender === 'male' ? 'M' : 'F'; // M/F formatına çevir
          
          console.log('🤖 ML Model için veriler:', {
            age: userAge,
            gender: userGender,
            videoScore,
            textScore
          });
          
          // Test sonuçlarını ML API formatına dönüştür
          // Her soru için 0 veya 1 (test başarısına göre)
          const videoAnswers = Array(30).fill(0).map((_, i) => {
            // Video test başarı oranına göre 0 veya 1
            return videoScore > 15 ? 1 : 0; // 15'ten fazla doğru cevap = 1, değilse 0
          });
          const textAnswers = Array(30).fill(0).map((_, i) => {
            // Text test başarı oranına göre 0 veya 1
            return textScore > 15 ? 1 : 0; // 15'ten fazla doğru cevap = 1, değilse 0
          });
          
          console.log('🔄 ML API\'ye gönderilecek veriler:', {
            age: userAge,
            gender: userGender,
            video_answers: videoAnswers,
            text_answers: textAnswers
          });
          
          // Gerçek ML modelini çağır
          try {
            const { predictLearningStyle } = await import('@/lib/mlApi');
            const prediction = await predictLearningStyle({
              age: userAge,
              gender: userGender,
              video_answers: videoAnswers,
              text_answers: textAnswers,
              time_video: videoTest?.time_spent || 300,
              time_text: textTest?.time_spent || 600,
              time_total: (videoTest?.time_spent || 300) + (textTest?.time_spent || 600),
              video_easy: Math.min(Math.floor((videoScore || 0) * 0.3), 30),
              video_medium: Math.min(Math.floor((videoScore || 0) * 0.4), 30),
              video_hard: Math.min(Math.floor((videoScore || 0) * 0.3), 30),
              text_easy: Math.min(Math.floor((textScore || 0) * 0.3), 30),
              text_medium: Math.min(Math.floor((textScore || 0) * 0.4), 30),
              text_hard: Math.min(Math.floor((textScore || 0) * 0.3), 30),
              efficiency_video: (videoScore || 0) / ((videoTest?.time_spent || 300) / 60),
              efficiency_text: (textScore || 0) / ((textTest?.time_spent || 600) / 60)
            });
            
            console.log('🎯 ML Model Tahmini:', prediction);
            
            // ML modelinin sonucunu kullan
            let learningStyle = 'Karma';
            let confidence = prediction.confidence;
            let recommendations: string[] = [];
            
            switch (prediction.predicted_style) {
              case 'video':
                learningStyle = 'Görsel';
                recommendations = prediction.recommendation.learning_tips;
                break;
              case 'text':
                learningStyle = 'Yazılı';
                recommendations = prediction.recommendation.learning_tips;
                break;
              case 'equal':
                learningStyle = 'Karma';
                recommendations = prediction.recommendation.learning_tips;
                break;
            }
            
            console.log('✅ ML Model Sonucu:', {
              learningStyle,
              confidence,
              recommendations
            });
            
            setUserLearningStyle({
              style: learningStyle,
              confidence: confidence,
              recommendations: recommendations
            });
            
          } catch (mlError) {
            console.error('❌ ML Model Hatası:', mlError);
            
            // ML modeli çalışmazsa hata göster
            setUserLearningStyle({
              style: 'Bilinmiyor',
              confidence: 0,
              recommendations: ['ML modeli şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.']
            });
          }
        }
      }
    } catch (error) {
      console.error('Öğrenme stili yükleme hatası:', error);
    }
  }, [user]);

  const loadDashboardData = useCallback(async () => {
    try {
      if (user) {
        // Load courses from file
        const allCourses = await getAllCourses();
        const publishedCourses = allCourses.filter((course: any) => course.isPublished);
        setCourses(publishedCourses);
        
        // Load user's education history from JSON file
        const completedContents = await getCompletedContentCount(user.id);
        const averageScore = await getUserAverageScore(user.id);
        const totalTimeSpent = await getUserTotalTimeSpent(user.id);
        
        // Calculate real stats
        const totalContents = publishedCourses.length;
        
        setStats({
          totalContents,
          completedContents,
          averageScore,
          totalTimeSpent
        });
        
        // Öğrenme stilini yükle
        await loadUserLearningStyle();
      }
    } catch (error) {
      console.error("Dashboard yüklenirken hata:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, loadUserLearningStyle]);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login?next=%2Fdashboard';
      return;
    }
    
    if (user) {
      loadDashboardData();
    }
  }, [user, loading, loadDashboardData]);


  if (loading || isLoading) {
    return (
      <div className="bg-gray-50">
        <div className="h-14" />
        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="h-16" />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="space-y-4">
              <h1 className="heading-1">
                <span className="gradient-text">Hoş Geldiniz</span><br/>
                <span className="gradient-text">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`.trim()
                    : user.user_metadata?.full_name || user.email.split('@')[0]
                  }!
                </span>
              </h1>
              <p className="body-large text-muted-foreground max-w-3xl mx-auto">
                Kişiselleştirilmiş öğrenme yolculuğunuz devam ediyor. Bugün hangi konuya odaklanmak istiyorsunuz?
              </p>
            </div>
          </div>


          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative border-none shadow-lg bg-card/50 backdrop-blur-sm card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold gradient-text">{stats.totalContents}</p>
                      <p className="text-sm text-muted-foreground font-medium">Toplam İçerik</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative border-none shadow-lg bg-card/50 backdrop-blur-sm card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">{stats.completedContents}</p>
                      <p className="text-sm text-muted-foreground font-medium">Tamamlanan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative border-none shadow-lg bg-card/50 backdrop-blur-sm card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-600">{stats.averageScore}%</p>
                      <p className="text-sm text-muted-foreground font-medium">Ortalama Başarı</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative border-none shadow-lg bg-card/50 backdrop-blur-sm card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-600">{stats.totalTimeSpent}</p>
                      <p className="text-sm text-muted-foreground font-medium">Toplam Dakika</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recommended Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative border-none shadow-xl bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="gradient-text">Önerilen İçerikler</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {courses.length > 0 ? (
                      <div className="space-y-4">
                        {courses.slice(0, 3).map((course, index) => (
                          <div 
                            key={course.id} 
                            className="group/card p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                            onClick={() => handleCourseClick(course)}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover/card:shadow-lg transition-all duration-300">
                                {course.type === 'VIDEO' ? (
                                  <PlayCircle className="w-6 h-6 text-primary-foreground" />
                                ) : (
                                  <FileText className="w-6 h-6 text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground mb-2 group-hover/card:text-primary transition-colors duration-200">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{course.description}</p>
                                <div className="flex items-center space-x-3 text-xs">
                                  <span className="px-3 py-1 bg-accent/50 text-accent-foreground rounded-full font-medium">{course.category}</span>
                                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                    {course.type === 'VIDEO' ? 'Videolu İçerik' : 'Yazılı İçerik'}
                                  </span>
                                  {course.duration && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                      {course.duration} dk
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-accent/50 rounded-lg flex items-center justify-center group-hover/card:bg-primary/10 transition-colors duration-200">
                                  <PlayCircle className="w-4 h-4 text-muted-foreground group-hover/card:text-primary transition-colors duration-200" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Brain className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Henüz içerik bulunmuyor</h3>
                        <p className="text-muted-foreground mb-6">Yeni eğitim içerikleri yakında eklenecek!</p>
                        <Button variant="gradient" size="lg">
                          İçerikleri Keşfet
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative border-none shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold gradient-text">Hızlı Erişim</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="gradient"
                      className="w-full justify-start h-12 text-left"
                      onClick={() => window.location.href = '/icerikler'}
                    >
                      <PlayCircle className="w-5 h-5 mr-3" />
                      Yeni İçerik Başlat
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 text-left hover:bg-accent/50"
                      onClick={() => window.location.href = '/sonuclar'}
                    >
                      <Award className="w-5 h-5 mr-3" />
                      Sonuçlarımı Gör
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Summary */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative border-none shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold gradient-text">İlerleme Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-3 font-medium">
                        <span className="text-muted-foreground">Tamamlanan İçerikler</span>
                        <span className="text-foreground font-semibold">{stats.completedContents}/{stats.totalContents}</span>
                      </div>
                      <Progress 
                        value={stats.totalContents > 0 ? (stats.completedContents / stats.totalContents) * 100 : 0} 
                        className="h-3 bg-accent/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                        <p className="text-2xl font-bold gradient-text">{stats.averageScore}%</p>
                        <p className="text-sm text-muted-foreground font-medium">Ortalama Başarı</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl border border-green-500/20">
                        <p className="text-2xl font-bold text-green-600">{stats.totalTimeSpent}</p>
                        <p className="text-sm text-muted-foreground font-medium">Toplam Dakika</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Kişiselleştirilmiş Öneriler - Test Çözülmüşse - Sayfanın En Altında */}
          {userLearningStyle && (
            <div className="mt-8 relative overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/3 to-primary/5 rounded-2xl"></div>
              
              {/* Main Card */}
              <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold gradient-text">
                        Sana Önerilen İçerik
                      </CardTitle>
                      <p className="text-gray-600 mt-1">AI analiz sonuçlarınız</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Learning Style Badge */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                            <Target className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Öğrenme Stilin</h3>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold gradient-text">
                                {userLearningStyle.style}
                              </span>
                              <div className="bg-white/80 px-3 py-1 rounded-full border border-primary/20">
                                <span className="text-sm font-semibold text-primary">
                                  {(userLearningStyle.confidence * 100).toFixed(0)}% Güven
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Kişiselleştirilmiş Öneriler</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userLearningStyle.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-white/80 rounded-xl border border-primary/20 hover:border-primary/30 transition-all duration-300">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary-foreground text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tip Section */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <h4 className="font-bold text-gray-900">İpucu</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Bu önerilere göre içerikleri filtreleyerek <strong className="text-primary">daha etkili öğrenebilirsiniz</strong>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}


          {/* Test Çözme Önerisi - Test Çözülmemişse - En Altta */}
          {!userLearningStyle && (
            <div className="mt-8 relative overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/3 to-primary/5 rounded-2xl"></div>
              
              {/* Main Card */}
              <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold gradient-text">
                        Kişiselleştirilmiş Öneriler
                      </CardTitle>
                      <p className="text-gray-600 mt-1">AI destekli öğrenme analizi</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                          <Brain className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analiz Yapalım!</h3>
                         <p className="text-gray-700 leading-relaxed">
                           Size en uygun öğrenme yöntemini belirlemek için önce <strong className="gradient-text">Matematik</strong> ya da <strong className="gradient-text">Türkçe</strong> derslerinden birine ait <strong className="gradient-text">yazılı</strong> ve <strong className="gradient-text">videolu</strong> içerikleri izleyin, ardından ilgili testleri çözün.
                         </p>
                        </div>
                      </div>
                    </div>

                    {/* Test Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-blue-200 group-hover:border-blue-300 transition-all duration-300">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <PlayCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Video Testi</h4>
                              <p className="text-sm text-gray-600">Görsel öğrenme</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>30 soru</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                              <span>10 dakika</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-all duration-300"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-emerald-200 group-hover:border-emerald-300 transition-all duration-300">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Yazılı Testi</h4>
                              <p className="text-sm text-gray-600">Metin öğrenme</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span>30 soru</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              <span>15 dakika</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Result Preview */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <h4 className="font-bold text-gray-900">Sonuç</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <strong className="text-primary">AI, test sonuçlarınıza göre size özel öğrenme önerileri sunacak!</strong>
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => {
                          console.log('Buton tıklandı!');
                          window.location.href = '/icerikler';
                        }}
                        variant="gradient"
                        className="w-full max-w-md font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        İçerikleri İncele
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Content Display Modal */}
      {showModal && selectedCourse && (
        <ContentDisplayModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedCourse(null);
          }}
          content={selectedCourse}
        />
      )}
    </div>
  );
}
