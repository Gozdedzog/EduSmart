'use client';

import { Navbar } from '@/components/layout/Navbar';
import { getAllCourses } from '@/lib/fileCourseDatabase';
import { Course, getDefaultCourses } from '@/lib/courseDatabase';
import ContentCard from '@/components/ContentCard';
import ContentDisplayModal from '@/components/ContentDisplayModal';
import { Section } from '@/components/ui/Section';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/HybridAuthProvider';
import { Target } from 'lucide-react';

interface RecommendationResponse {
  items: Array<{
    contentId: string;
    score: number;
  }>;
}

// getPersonalizedContents fonksiyonunu tamamen kaldırıyorum.

export default function IceriklerPage({
  searchParams,
}: {
  searchParams: Promise<{ personalized?: string; userId?: string; category?: string; type?: string; contentId?: string }>;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filteredContents, setFilteredContents] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const resolvedSearchParams = use(searchParams);
  const [currentSearchParams, setCurrentSearchParams] = useState(resolvedSearchParams);
  const [selectedContent, setSelectedContent] = useState<Course | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  // Dinamik kategorileri çek
  const allCategories = Array.from(new Set(allCourses.map(course => course.category)));

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?next=${encodeURIComponent('/icerikler')}`);
    }
  }, [user, loading, router]);

  // Eğitimleri yükle
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await getAllCourses();
        // Sadece yayınlanmış kursları filtrele
        const publishedCourses = courses.filter(course => course.isPublished);
        setAllCourses(publishedCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };
    
    loadCourses();
  }, []);

  useEffect(() => {
    setCurrentSearchParams(resolvedSearchParams);
  }, [resolvedSearchParams]);

  // contentId parametresini işle
  useEffect(() => {
    if (currentSearchParams.contentId && allCourses.length > 0) {
      const content = allCourses.find(course => course.id === currentSearchParams.contentId);
      if (content) {
        setSelectedContent(content);
        setShowContentModal(true);
      }
    }
  }, [currentSearchParams.contentId, allCourses]);

  useEffect(() => {
    let currentContents = [...allCourses];

    const isPersonalized = currentSearchParams.personalized === '1' && currentSearchParams.userId;
    const selectedCategory = currentSearchParams.category || 'Tüm Kategoriler';
    const selectedType = currentSearchParams.type || 'Tüm Türler';

    // Filter by category
    if (selectedCategory !== 'Tüm Kategoriler') {
      currentContents = currentContents.filter(course => course.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== 'Tüm Türler') {
      currentContents = currentContents.filter(course => {
        if (selectedType === 'Yazılı İçerik' && course.type === 'ARTICLE') return true;
        if (selectedType === 'Videolu İçerik' && course.type === 'VIDEO') return true;
        return false;
      });
    }
    setFilteredContents(currentContents);
  }, [currentSearchParams, allCourses]); // allCourses değiştiğinde filtrelemeyi tetikle


  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isPersonalized = currentSearchParams.personalized === '1' && currentSearchParams.userId;
  const selectedCategory = currentSearchParams.category || 'Tüm Kategoriler';
  const selectedType = currentSearchParams.type || 'Tüm Türler';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
      
      <Section>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
          <a href="/" className="hover:text-foreground transition-colors duration-200 font-medium">
            Dashboard
          </a>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">İçerikler</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 animate-slide-up">
          <div className="space-y-4">
            <h1 className="heading-1">
              <span className="gradient-text">Öğrenme İçerikleri</span>
            </h1>
            <p className="body-large text-muted-foreground max-w-3xl">
              Size özel hazırlanmış eğitim içeriklerini keşfedin. Her biri yaklaşık
              15 dakika sürmektedir.
            </p>
          </div>
        </div>

        {/* Premium Filter Bar */}
        <div className="group relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-3xl"></div>
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-white/90 via-white/95 to-white/90 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="heading-3 gradient-text">Filtreler</h2>
                  <p className="text-sm text-muted-foreground">İçeriklerinizi akıllıca filtreleyin</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">Aktif Filtreler</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  İçerik Türü
                </label>
                <div className="relative group">
                  <select 
                    className="w-full px-6 py-5 border-2 border-primary/30 rounded-2xl bg-gradient-to-r from-white via-white/95 to-white/90 backdrop-blur-xl text-foreground focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl font-semibold appearance-none group-hover:scale-[1.02] group-hover:border-primary/50 text-base"
                    value={selectedType}
                    onChange={(e) => {
                      const newSearchParams = new URLSearchParams(window.location.search);
                      if (e.target.value === 'Tüm Türler') {
                        newSearchParams.delete('type');
                      } else {
                        newSearchParams.set('type', e.target.value);
                      }
                      router.replace(`?${newSearchParams.toString()}`);
                    }}
                  >
                    <option>Tüm Türler</option>
                    <option>Yazılı İçerik</option>
                    <option>Videolu İçerik</option>
                  </select>
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-primary drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Kategori
                </label>
                <div className="relative group">
                  <select 
                    className="w-full px-6 py-5 border-2 border-accent/30 rounded-2xl bg-gradient-to-r from-white via-white/95 to-white/90 backdrop-blur-xl text-foreground focus:ring-4 focus:ring-accent/30 focus:border-accent transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl font-semibold appearance-none group-hover:scale-[1.02] group-hover:border-accent/50 text-base"
                    value={selectedCategory}
                    onChange={(e) => {
                      const newSearchParams = new URLSearchParams(window.location.search);
                      if (e.target.value === 'Tüm Kategoriler') {
                        newSearchParams.delete('category');
                      }
                      else {
                        newSearchParams.set('category', e.target.value);
                      }
                      router.replace(`?${newSearchParams.toString()}`);
                    }}
                  >
                    <option>Tüm Kategoriler</option>
                    {allCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-accent drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
            
            {/* Filter Stats */}
            <div className="mt-8 pt-6 border-t border-primary/10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    <span className="font-bold text-primary">{filteredContents.length}</span> içerik bulundu
                  </span>
                  {(selectedType !== 'Tüm Türler' || selectedCategory !== 'Tüm Kategoriler') && (
                    <button
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(window.location.search);
                        newSearchParams.delete('type');
                        newSearchParams.delete('category');
                        router.replace(`?${newSearchParams.toString()}`);
                      }}
                      className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Canlı Filtreleme</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalization Notice */}
        {isPersonalized && (
          <div className="group relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl"></div>
            <div className="relative rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-primary font-semibold">
                  İçerikler kullanıcı {currentSearchParams.userId} için kişiselleştirilmiştir
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredContents.map((content, index) => (
            <div 
              key={content.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ContentCard content={content} />
            </div>
          ))}
        </div>
      </Section>

      {/* Content Display Modal */}
      {selectedContent && (
        <ContentDisplayModal
          open={showContentModal}
          onClose={() => {
            setShowContentModal(false);
            setSelectedContent(null);
            // URL'den contentId parametresini kaldır
            const newSearchParams = new URLSearchParams(window.location.search);
            newSearchParams.delete('contentId');
            router.replace(`?${newSearchParams.toString()}`);
          }}
          content={selectedContent}
        />
      )}
    </div>
  );
}
