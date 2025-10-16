'use client';

import { useState, useEffect, useRef } from 'react';
import { Course } from '@/lib/courseDatabase';
import { useAuth } from '@/context/HybridAuthProvider';
import { useRouter } from 'next/navigation';
import { getUserRating, saveUserRating } from '@/lib/userRatings';
import { getAllTests } from '@/lib/testDatabase';
import { addEgitimGecmisi, updateEgitimGecmisi, getUserEgitimGecmisi } from '@/lib/egitimGecmisiDatabase';
import { updateContentCompletion, markContentAsCompleted, getContentProgress } from '@/lib/contentCompletionDatabase';
import { addTestSonucu } from '@/lib/testSonuclariDatabase';

// YouTube IFrame API tiplerini genişlet
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface ContentDisplayModalProps {
  open: boolean;
  onClose: () => void;
  content: Course; // Course objesini alacak
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // Index of the correct option
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // Index of the correct option
}

interface TestResult {
  score?: number;
}

// Analytics tracking (non-blocking)
const track = (event: string, data: any) => {
  console.log('Analytics:', event, data);
  // Future: Send to analytics service
};

// YouTube URL'lerini embed formatına çevir
const convertToEmbedUrl = (url: string): string => {
  // Eğer zaten embed URL'i ise, olduğu gibi döndür
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // YouTube watch URL'lerini embed formatına çevir
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // YouTube youtu.be URL'lerini embed formatına çevir
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Eğer geçerli bir YouTube URL'i değilse, varsayılan bir video göster
  return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
};

export default function ContentDisplayModal({
  open,
  onClose,
  content,
}: ContentDisplayModalProps) {
  const { user, loading } = useAuth();
  
  // Content yoksa modal'ı kapat
  if (!content) {
    console.error('ContentDisplayModal - Content prop is missing!');
    return null;
  }
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [hasTestHistory, setHasTestHistory] = useState(false);

  // YouTube IFrame API için state'ler
  const [showVideoEndModal, setShowVideoEndModal] = useState(false);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasShownEvaluation, setHasShownEvaluation] = useState(false);
  
  // Değerlendirme için state'ler
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [savedRating, setSavedRating] = useState(0);
  
  // Test için state'ler
  const [showTest, setShowTest] = useState(false);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [isTestLoading, setIsTestLoading] = useState(false);

  // Debug: Content prop'unu kontrol et
  console.log('ContentDisplayModal - Content prop:', content);
  console.log('ContentDisplayModal - Content type:', content?.type);
  console.log('ContentDisplayModal - Content title:', content?.title);
  console.log('ContentDisplayModal - ShowTest state:', showTest);

  // Kullanıcının mevcut puanını yükle
  useEffect(() => {
    if (user && content) {
      // Eski puanlama sisteminin verilerini temizle
      const oldRatingKey = `rating.${content.id}`;
      if (localStorage.getItem(oldRatingKey)) {
        console.log('Removing old rating data:', oldRatingKey);
        localStorage.removeItem(oldRatingKey);
      }

      const userRating = getUserRating(user.id, content.id);
      console.log('Loading user rating:', { userId: user.id, contentId: content.id, userRating });
      if (userRating) {
        setSavedRating(userRating);
        setRating(userRating);
      } else {
        // Yeni kullanıcı için puanları sıfırla
        setSavedRating(0);
        setRating(0);
      }
    }
  }, [user, content]);

  // Test sorularını yükle
  useEffect(() => {
    if (content) {
      fetchTestQuestions();
    }
  }, [content]);

  // İçerik tipine göre test sorularını async olarak yükle
  const fetchTestQuestions = async () => {
    if (!content) return;
    
    setIsTestLoading(true);
    try {
      const allTests = getAllTests();
      console.log('=== TEST LOADING DEBUG ===');
      console.log('All tests loaded:', allTests.length);
      console.log('Content title:', content.title);
      console.log('Content type:', content.type);
      console.log('Content ID:', content.id);
      
      // Tüm testleri listele
      allTests.forEach((test, index) => {
        console.log(`Test ${index + 1}:`, {
          id: test.id,
          title: test.title,
          questionCount: test.questions?.length || 0,
          category: test.category
        });
      });
      
      let questions: Question[] = [];
      
      // İçerik ID'sine göre test bulma
      if (content.id === '1' || content.title.toLowerCase().includes('temel kavramlar')) {
        // Temel kavramlar için video veya yazılı testi bul
        const test = allTests.find(t => 
          t.title.toLowerCase().includes('temel kavramlar') && 
          ((content.type === 'VIDEO' && t.title.includes('Video')) ||
           (content.type === 'ARTICLE' && t.title.includes('Yazılı')))
        );
        console.log('Found basic concepts test:', test?.title, 'Questions:', test?.questions?.length);
        questions = test?.questions || [];
      } else if (content.id === '2' || content.title.toLowerCase().includes('noktalama')) {
        // Noktalama işaretleri için video veya yazılı testi bul
        const test = allTests.find(t => 
          t.title.toLowerCase().includes('noktalama') && 
          ((content.type === 'VIDEO' && t.title.includes('Video')) ||
           (content.type === 'ARTICLE' && t.title.includes('Yazılı')))
        );
        console.log('Found punctuation test:', test?.title, 'Questions:', test?.questions?.length);
        questions = test?.questions || [];
      }
      
      console.log('Final questions count:', questions.length);
      console.log('=== END DEBUG ===');
      setTestQuestions(questions);
    } catch (error) {
      console.error('Error loading test questions:', error);
      setTestQuestions([]);
    } finally {
      setIsTestLoading(false);
    }
  };


  // Course tipinde quiz soruları yok, basit bir quiz oluşturalım
  const QUIZ_QUESTIONS: QuizQuestion[] = testQuestions.map((q, index) => ({
    question: q.question,
    options: q.options,
    correct: q.correct,
  }));

  // YouTube IFrame API'yi yükle
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (typeof window !== 'undefined' && !window.YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        
        // YouTube API hazır olduğunda callback'i ayarla
        window.onYouTubeIframeAPIReady = () => {
          console.log('YouTube IFrame API loaded');
        };
        
        document.head.appendChild(script);
      }
    };

    loadYouTubeAPI();
  }, []);

  // YouTube player'ı başlat
  useEffect(() => {
    const initializePlayer = () => {
      if (open && content.type === 'VIDEO' && playerRef.current && window.YT && window.YT.Player) {
        const videoId = content.content.split('v=')[1]?.split('&')[0] || 
                       content.content.split('youtu.be/')[1]?.split('?')[0];
        
        if (videoId) {
          console.log('Initializing YouTube player with video ID:', videoId);
          const ytPlayer = new window.YT.Player(playerRef.current, {
            videoId: videoId,
            width: '100%',
            height: '100%',
            events: {
              onStateChange: (event: YT.PlayerEvent) => {
                if (event.data === YT.PlayerState.ENDED) {
                  setShowVideoEndModal(true);
                } else if (event.data === YT.PlayerState.PLAYING) {
                  console.log('Video oynatılmaya başladı, süre takibi başlatılıyor');
                  startVideoTimeTracking(event.target);
                }
              },
              onReady: (event: YT.PlayerEvent) => {
                console.log('YouTube player ready');
              },
              onError: (event: YT.PlayerEvent) => {
                console.error('YouTube player error:', event.data);
              }
            }
          });
          setPlayer(ytPlayer);
        }
      }
    };

    // API hazır değilse bekle
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // API yüklenene kadar bekle
      const checkAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkAPI);
          initializePlayer();
        }
      }, 100);

      // 5 saniye sonra timeout
      setTimeout(() => {
        clearInterval(checkAPI);
        if (!window.YT) {
          console.error('YouTube API failed to load');
        }
      }, 5000);
    }
  }, [open, content]);

  // Video süresini takip etmek için fonksiyon
  const startVideoTimeTracking = (player: YT.Player) => {
    console.log('Video süresi takibi başlatıldı');
    
    const timeInterval = setInterval(() => {
      try {
        if (player && typeof player.getCurrentTime === 'function') {
          const time = player.getCurrentTime();
          setCurrentTime(time);
          
          // İçerik ilerlemesini güncelle
          if (user && content) {
            const progressPercentage = Math.min(100, (time / 600) * 100); // 10 dakika = 600 saniye
            const timeSpentMinutes = Math.floor(time / 60);
            
            updateContentCompletion(
              user.id,
              content.id,
              content.type as 'VIDEO' | 'ARTICLE' | 'AUDIO',
              progressPercentage,
              timeSpentMinutes
            );
          }
          
          // 10:34 saniyesinde (634 saniye) değerlendirme ekranını göster
          // 10 dakika 34 saniye = 10*60 + 34 = 634 saniye
          console.log(`Video süresi: ${Math.floor(time/60)}:${Math.floor(time%60).toString().padStart(2, '0')} (${time} saniye)`);
          if (time >= 640 && !hasShownEvaluation) {
            console.log('10:40 saniyesine ulaşıldı, modal açılıyor');
            setHasShownEvaluation(true);
            setShowVideoEndModal(true);
            
            // Video tamamlandı olarak işaretle
            if (user && content) {
              markContentAsCompleted(
                user.id,
                content.id,
                content.type as 'VIDEO' | 'ARTICLE' | 'AUDIO',
                Math.floor(time / 60)
              );
            }
            
            clearInterval(timeInterval);
          }
        }
      } catch (error) {
        console.error('Video süresi alınırken hata:', error);
      }
    }, 1000);

    return timeInterval;
  };

  useEffect(() => {
    if (open) {
      // Modal her açıldığında değerlendirme durumunu sıfırla
      setHasShownEvaluation(false);
      
      // Session kontrolü yap
      if (!loading && !user) {
        // Kullanıcı oturum açmamış, modal'ı kapat ve login sayfasına yönlendir
        onClose();
        router.push('/auth/login?next=' + encodeURIComponent('/icerikler'));
        return;
      }
      
      if (user) {
      track('open_modal', { content_id: content.id });
      
      // Test skoru ve puanı yükle
      const storedScore = localStorage.getItem(`learning.${content.id}.score`);
      const storedRating = localStorage.getItem(`rating.${content.id}`);
      
      console.log('Modal açıldı - Content ID:', content.id);
      console.log('Stored Score:', storedScore);
      console.log('Stored Rating:', storedRating);
      
      // Test skoru varsa yükle (0'dan büyük olmalı)
      if (storedScore && parseInt(storedScore) > 0) {
        console.log('Test skoru bulundu, completed=true yapılıyor');
        setTestResults({ score: parseInt(storedScore) });
        setTestCompleted(true); // Test yapılmışsa completed olarak işaretle
        setHasTestHistory(true); // Kullanıcının test geçmişi var
      } else {
        console.log('Test skoru bulunamadı veya 0, completed=false yapılıyor');
        // Eğer skor 0 ise localStorage'dan temizle
        if (storedScore === '0') {
          localStorage.removeItem(`learning.${content.id}.score`);
          console.log('0 skoru localStorage\'dan temizlendi');
        }
        setTestResults({}); // Test skoru yoksa temizle
        setTestCompleted(false); // Test yapılmamışsa başlangıç durumuna getir
        setHasTestHistory(false); // Kullanıcının test geçmişi yok
      }
      
      // Puanı yükle
      if (storedRating) {
        setSavedRating(parseInt(storedRating));
      } else {
        setSavedRating(0); // Puan yoksa sıfırla
      }
    }
    }
  }, [open, content.id, user, loading, onClose, router]);

  const handleQuizComplete = async (score: number) => {
    console.log('Quiz tamamlandı, skor:', score);
    setTestResults({ score });
    setTestCompleted(true);
    setHasTestHistory(true); // Test tamamlandığında geçmişi işaretle
    // localStorage kaldırıldı - sadece JSON dosyası kullanılıyor
    
    // İçeriği tamamlandı olarak işaretle
    if (user && content) {
      markContentAsCompleted(
        user.id,
        content.id,
        content.type as 'VIDEO' | 'ARTICLE' | 'AUDIO',
        10 // Test için tahmini 10 dakika
      );
    }
    
    // İçeriği JSON dosyasına kaydet
    if (user) {
      try {
        // Önce mevcut geçmişi kontrol et
        const userGecmisi = await getUserEgitimGecmisi(user.id);
        const existingGecmis = userGecmisi.find(gecmis => gecmis.contentId === content.id);
        
        if (existingGecmis) {
          // Güncelle
          await updateEgitimGecmisi(existingGecmis.id, {
            score: score,
            completedAt: new Date().toISOString()
          });
        } else {
          // Yeni ekle
          await addEgitimGecmisi({
            userId: user.id,
            contentId: content.id,
            contentTitle: content.title,
            contentType: content.type,
            category: content.category,
            completedAt: new Date().toISOString(),
            score: score
          });
        }
        
        // Test sonucunu ayrı olarak kaydet
        await addTestSonucu({
          userId: user.id,
          testId: content.id,
          testTitle: content.title,
          category: content.category,
          score: score,
          correctAnswers: score,
          wrongAnswers: 0, // Quiz için hesaplanabilir
          totalQuestions: 1, // Quiz için varsayılan
          duration: 10,
          timeSpent: 10,
          completedAt: new Date().toISOString(),
          testType: content.type as 'VIDEO' | 'ARTICLE'
        });
      } catch (error) {
        console.error('Eğitim geçmişi kaydedilemedi:', error);
      }
    }
    
    setShowQuiz(false);
    track('submit_quiz', { content_id: content.id, score });
    // Test sonuç ekranını göster
    setShowVideoEndModal(true);
  };

  // Video bitiş modal'ı handler'ları
  const handleEvaluateVideo = () => {
    setShowVideoEndModal(false);
    setShowRatingModal(true);
    track('start_rating', { content_id: content.id });
  };

  const handleStartTest = () => {
    setShowVideoEndModal(false);
    setShowTest(true); // Yeni test modal'ını kullan (süre sayacı ile)
    // Test başladığında completed state'ini sıfırla
    setTestCompleted(false);
    track('start_test', { content_id: content.id });
  };

  const handleRatingSubmit = async () => {
    if (rating > 0 && user) {
      // Kullanıcı bazlı puanlama sistemini kullan
      saveUserRating(user.id, content.id, rating, user.role);
      setSavedRating(rating); // State'i güncelle
      
      // Video izlendiğinde içeriği JSON dosyasına kaydet
      try {
        // Önce mevcut geçmişi kontrol et
        const userGecmisi = await getUserEgitimGecmisi(user.id);
        const existingGecmis = userGecmisi.find(gecmis => gecmis.contentId === content.id);
        
        if (existingGecmis) {
          // Güncelle
          await updateEgitimGecmisi(existingGecmis.id, {
            rating: rating,
            completedAt: new Date().toISOString()
          });
        } else {
          // Yeni ekle
          await addEgitimGecmisi({
            userId: user.id,
            contentId: content.id,
            contentTitle: content.title,
            contentType: content.type,
            category: content.category,
            completedAt: new Date().toISOString(),
            rating: rating
          });
        }
      } catch (error) {
        console.error('Eğitim geçmişi kaydedilemedi:', error);
      }
      
      track('submit_rating', { content_id: content.id, rating, user_id: user.id, user_role: user.role });
      setShowRatingModal(false);
      setShowVideoEndModal(false);
      // Ana modal'ı da kapat
      onClose();
      // Eğitimler sayfasına yönlendir
      router.push('/icerikler');
    }
  };

  const handleRatingCancel = () => {
    setShowRatingModal(false);
    setShowVideoEndModal(true);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    track('start_quiz', { content_id: content.id });
  };

  const handleAnswerSelection = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz tamamlandı
      const score = selectedAnswers.filter(
        (answer, index) => answer === QUIZ_QUESTIONS[index].correct
      ).length;
      handleQuizComplete(score);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!open) return null;

  if (showQuiz) {
    return (
      <QuizComponent
        questions={QUIZ_QUESTIONS}
        onComplete={handleQuizComplete}
        onClose={() => setShowQuiz(false)}
        contentTitle={content.title}
      />
    );
  }

  return (
    <>
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className={`relative bg-white rounded-lg shadow-xl ${content.type === 'ARTICLE' ? 'max-w-7xl w-full max-h-[98vh]' : 'max-w-6xl w-full max-h-[95vh]'} overflow-y-auto`}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {content.title}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
              {!content && (
                <div className="text-center py-8">
                  <p className="text-gray-500">İçerik yükleniyor...</p>
                </div>
              )}
              {content && content.type === 'VIDEO' && (
              <div className="space-y-4">
                {console.log('Rendering VIDEO content for:', content.title)}
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                    <div ref={playerRef} className="w-full h-full">
                      {/* Always show iframe for now */}
                      <iframe
                        src={convertToEmbedUrl(content.content)}
                        title={content.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  
                  {/* Kullanıcı Puan Gösterimi */}
                  {savedRating > 0 && user && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          {user.role === 'admin' ? 'Admin Puanınız:' : 'Verdiğiniz Puan:'}
                        </span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= savedRating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {savedRating === 1 && "Çok kötü"}
                          {savedRating === 2 && "Kötü"}
                          {savedRating === 3 && "Orta"}
                          {savedRating === 4 && "İyi"}
                          {savedRating === 5 && "Mükemmel"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {user.role === 'admin' ? 'Admin değerlendirmesi' : 'Öğrenci değerlendirmesi'}
                      </div>
                    </div>
                  )}
              </div>
            )}

              {content && content.type === 'ARTICLE' && (
              <div className="prose max-w-none text-slate-700 space-y-4 px-12 py-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {content.title} - Yazılı İçerik
                </h3>
                <div 
                  onScroll={(e) => {
                    // Yazılı içerik scroll takibi
                    if (user && content) {
                      const element = e.target as HTMLElement;
                      const scrollTop = element.scrollTop;
                      const scrollHeight = element.scrollHeight;
                      const clientHeight = element.clientHeight;
                      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
                      
                      // %80 scroll edildiğinde tamamlandı olarak işaretle
                      if (scrollPercentage >= 80) {
                        markContentAsCompleted(
                          user.id,
                          content.id,
                          content.type as 'VIDEO' | 'ARTICLE' | 'AUDIO',
                          5 // Yazılı içerik için tahmini 5 dakika
                        );
                      } else {
                        // İlerleme durumunu güncelle
                        updateContentCompletion(
                          user.id,
                          content.id,
                          content.type as 'VIDEO' | 'ARTICLE' | 'AUDIO',
                          Math.min(100, scrollPercentage * 1.25), // %80 scroll = %100 tamamlama
                          5
                        );
                      }
                    }
                  }}
                  className="overflow-y-auto"
                >
                  <ArticleContent content={content.content} />
                </div>
              </div>
            )}

              {/* İçerik Testi Section */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {content.title.toLowerCase().includes('noktalama') ? 'Noktalama İşaretleri Testi' : 
                       content.title.toLowerCase().includes('temel kavramlar') ? 'Temel Kavramlar Testi' : 
                       'Test'}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {isTestLoading ? 'Test soruları yükleniyor...' : 
                       testQuestions.length > 0 ? 
                         `${testQuestions.length} soruluk ${content.title.toLowerCase().includes('noktalama') ? 'noktalama işaretleri' : 
                          content.title.toLowerCase().includes('temel kavramlar') ? 'temel kavramlar' : 
                          'test'} bilginizi test edin` :
                         'Test soruları yüklenemedi'
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowTest(true)}
                      disabled={testQuestions.length === 0}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        testQuestions.length === 0 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {testQuestions.length === 0 ? '⏳ Test Yükleniyor...' : 
                       'Teste Başla'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Bitiş Modal'ı */}
      {showVideoEndModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {testCompleted ? 'Test Tamamlandı!' : hasShownEvaluation ? 'Video İzleme Süresi Tamamlandı!' : 'Tebrikler!'}
                  </h3>
                  <p className="text-gray-600">
                    {testCompleted 
                      ? `Testinizi tamamladınız! Skorunuz: ${testResults.score}/10`
                      : hasShownEvaluation 
                        ? 'Video 10:34 saniyesine ulaştı. Değerlendirme yapabilirsiniz.'
                        : 'Videoyu başarıyla izlediniz. Ne yapmak istersiniz?'
                    }
                  </p>
                </div>
                
                <div className="space-y-3">
                  {testCompleted ? (
                    <>
                      <button
                        onClick={handleStartTest}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🔄 Testi Tekrar Yap
                      </button>
                      <button
                        onClick={handleEvaluateVideo}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ⭐ Videoyu Değerlendir
                      </button>
                      <button
                        onClick={handleGoHome}
                        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        🏠 Ana Sayfaya Dön
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleStartTest}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📝 Teste Başla
                      </button>
                      <button
                        onClick={handleEvaluateVideo}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ⭐ Videoyu Değerlendir
                      </button>
                      <button
                        onClick={handleGoHome}
                        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        🏠 Ana Sayfaya Dön
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yıldız Puanlama Modal'ı */}
      {showRatingModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Videoyu Değerlendirin
                  </h3>
                  <p className="text-gray-600">
                    Bu videoyu nasıl buldunuz?
                  </p>
                </div>
                
                {/* Yıldız Puanlama */}
                <div className="mb-6">
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-3xl transition-colors"
                      >
                        {star <= (hoveredRating || rating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {rating === 0 && "Puanınızı seçin"}
                    {rating === 1 && "Çok kötü"}
                    {rating === 2 && "Kötü"}
                    {rating === 3 && "Orta"}
                    {rating === 4 && "İyi"}
                    {rating === 5 && "Mükemmel"}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleRatingSubmit}
                    disabled={rating === 0}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✅ Değerlendirmeyi Gönder
                  </button>
                  <button
                    onClick={handleRatingCancel}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ❌ İptal
                  </button>
                </div>
          </div>
        </div>
      </div>
    </div>
      )}

      {/* İçerik Testi Modal'ı */}
      {showTest && (
        <div className="fixed inset-0 z-[60]">
          <TestModal
            questions={testQuestions}
            onClose={() => {
              console.log('Test modal closing, returning to main content');
              setShowTest(false);
            }}
            contentTitle={content.title}
            content={content}
            user={user}
          />
        </div>
      )}

    </>
  );
}

// Quiz Component
function QuizComponent({
  questions,
  onComplete,
  onClose,
  contentTitle,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
  contentTitle: string;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleAnswerSelection = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz tamamlandı
      const score = selectedAnswers.filter(
        (answer, index) => answer === questions[index].correct
      ).length;
      console.log('Quiz tamamlandı! Skor:', score, '/', questions.length);
      onComplete(score);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {contentTitle} - Bilgi Testi
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
          </div>

          {/* Quiz Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">
                  Soru {currentQuestionIndex + 1} / {questions.length}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-2 mx-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                {questions[currentQuestionIndex].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Önceki
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Tamamla' : 'Sonraki →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

// ArticleContent component - Markdown editörden gelen içeriği gösterir
function ArticleContent({ content }: { content: string }) {
  // Markdown içeriğini HTML'e çevirmek için basit bir parser
  const parseMarkdown = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>')
      .replace(/^(.*)$/gim, '<p>$1</p>');
  };

  const createMarkup = (markdownContent: string) => {
    return { __html: parseMarkdown(markdownContent) };
  };

  return (
    <div className="space-y-4">
      <div 
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={createMarkup(content)}
      />
    </div>
  );
}

// Test Modal Component
function TestModal({
  questions,
  onClose,
  contentTitle,
  content,
  user,
}: {
  questions: Question[];
  onClose: () => void;
  contentTitle: string;
  content: any;
  user: any;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [hasTestHistory, setHasTestHistory] = useState(false);
  
  // 30 soruluk süreli test için süre sayacı
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 dakika = 1800 saniye
  const [isTimedTest, setIsTimedTest] = useState(questions.length === 30);

  // Süre sayacı
  useEffect(() => {
    if (isTimedTest && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isTimedTest && timeLeft === 0 && !showResults) {
      // Süre dolduğunda testi otomatik bitir
      handleFinishTest();
    }
  }, [timeLeft, isTimedTest, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = async () => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correctCount++;
      }
    });
    console.log('Test tamamlandı! Skor:', correctCount, '/', questions.length);
    setScore(correctCount);
    setShowResults(true);
    setHasTestHistory(true); // Test tamamlandığında geçmişi işaretle
    
    // İçeriği tamamlandı olarak işaretle
    if (user && content) {
      markContentAsCompleted(
        user.id,
        content.id,
        content.type as 'VIDEO' | 'ARTICLE' | 'AUDIO',
        10 // Test için tahmini 10 dakika
      );
    }
    
    // Test tamamlandığında içeriği JSON dosyasına kaydet
    if (user) {
      try {
        // Önce mevcut geçmişi kontrol et
        const userGecmisi = await getUserEgitimGecmisi(user.id);
        const existingGecmis = userGecmisi.find(gecmis => gecmis.contentId === content.id);
        
        if (existingGecmis) {
          // Güncelle
          await updateEgitimGecmisi(existingGecmis.id, {
            score: correctCount,
            completedAt: new Date().toISOString()
          });
        } else {
          // Yeni ekle
          await addEgitimGecmisi({
            userId: user.id,
            contentId: content.id,
            contentTitle: content.title,
            contentType: content.type,
            category: content.category,
            completedAt: new Date().toISOString(),
            score: correctCount
          });
        }
        
        // Test sonucunu ayrı olarak kaydet
        await addTestSonucu({
          userId: user.id,
          testId: content.id,
          testTitle: content.title,
          category: content.category,
          score: Math.round((correctCount / questions.length) * 100),
          correctAnswers: correctCount,
          wrongAnswers: questions.length - correctCount,
          totalQuestions: questions.length,
          duration: 30, // Varsayılan süre
          timeSpent: 30,
          completedAt: new Date().toISOString(),
          testType: content.type as 'VIDEO' | 'ARTICLE'
        });
      } catch (error) {
        console.error('Eğitim geçmişi kaydedilemedi:', error);
      }
    }
    
    console.log('showResults true yapıldı');
  };

  const handleRestartTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
    // Test geçmişi yoksa, test başlatma olarak işaretle
    if (!hasTestHistory) {
      setHasTestHistory(true);
    }
  };

  if (showResults) {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="fixed inset-0 z-60 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Tamamlandı!</h1>
                <p className="text-lg text-gray-600">{contentTitle}</p>
              </div>

              <div className="bg-white border rounded-lg p-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-4">{percentage}%</div>
                  <p className="text-xl text-gray-600 mb-6">
                    {correctAnswers} / {questions.length} doğru cevap
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
                      <div className="text-sm text-gray-600">Doğru Cevap</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{questions.length - correctAnswers}</div>
                      <div className="text-sm text-gray-600">Yanlış Cevap</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{questions.length}</div>
                      <div className="text-sm text-gray-600">Toplam Soru</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleRestartTest}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4 transition-colors font-medium"
                    >
                      🔄 Testi Tekrar Yap
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      ❌ Kapat
                    </button>
                  </div>
                </div>
              </div>

              {/* Detaylı Sonuçlar */}
              <div className="bg-white border rounded-lg">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Detaylı Sonuçlar</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {questions.map((question, index) => {
                      const userAnswer = answers[index];
                      const isCorrect = userAnswer === question.correct;
                      
                      return (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {isCorrect ? (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-2">
                                {index + 1}. {question.question}
                              </p>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => {
                                  let bgColor = 'bg-gray-50';
                                  let textColor = 'text-gray-700';
                                  
                                  if (optionIndex === question.correct) {
                                    bgColor = 'bg-green-100';
                                    textColor = 'text-green-800';
                                  } else if (optionIndex === userAnswer && !isCorrect) {
                                    bgColor = 'bg-red-100';
                                    textColor = 'text-red-800';
                                  }
                                  
                                  return (
                                    <div
                                      key={optionIndex}
                                      className={`p-3 rounded-lg ${bgColor} ${textColor}`}
                                    >
                                      <div className="flex items-center">
                                        <span className="font-medium mr-2">
                                          {String.fromCharCode(65 + optionIndex)}.
                                        </span>
                                        <span>{option}</span>
                                        {optionIndex === question.correct && (
                                          <span className="ml-auto text-green-600 font-semibold">
                                            ✓ Doğru
                                          </span>
                                        )}
                                        {optionIndex === userAnswer && !isCorrect && (
                                          <span className="ml-auto text-red-600 font-semibold">
                                            ✗ Seçtiğiniz
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              {question.explanation && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>Açıklama:</strong> {question.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {contentTitle} - {contentTitle.toLowerCase().includes('noktalama') ? 'Noktalama İşaretleri Testi' : 
                                 contentTitle.toLowerCase().includes('temel kavramlar') ? 'Temel Kavramlar Testi' : 
                                 'Test'}
                </h2>
                {isTimedTest && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-blue-600 font-medium">⏱️ 30 Soruluk Süreli Test</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      Kalan Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Test Content */}
          <div className="p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">
                  Soru {currentQuestion + 1} / {questions.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-3 mx-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {question.question}
              </h3>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                ← Önceki
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleFinishTest}
                  disabled={answers[currentQuestion] === undefined}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  ✅ Testi Bitir
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === undefined}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Sonraki →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
