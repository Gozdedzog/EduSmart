'use client';

import { Badge } from '@/components/Badge';
import { Course } from '@/lib/courseDatabase';
import ContentDisplayModal from '@/components/ContentDisplayModal';
import { useState } from 'react';
import { useAuth } from '@/context/HybridAuthProvider';
import { useRouter } from 'next/navigation';
import { FileText, Play, Clock, ArrowRight } from 'lucide-react';

interface ContentCardProps {
  content: Course;
}

export default function ContentCard({ content }: ContentCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const getKindIcon = (type: string) => {
    switch (type) {
      case 'ARTICLE':
        return <FileText className="w-4 h-4" />;
      case 'VIDEO':
        return <Play className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getKindLabel = (type: string) => {
    switch (type) {
      case 'ARTICLE':
        return 'Yazılı İçerik';
      case 'VIDEO':
        return 'Videolu İçerik';
      default:
        return 'İçerik';
    }
  };

  const handleStartClick = () => {
    // Session kontrolü yap
    if (loading) {
      return; // Hala yükleniyor, bekle
    }
    
    if (!user) {
      // Kullanıcı oturum açmamış, login sayfasına yönlendir
      router.push('/auth/login?next=' + encodeURIComponent('/icerikler'));
      return;
    }
    
    // Kullanıcı oturum açmış, modal'ı aç
    setShowModal(true);
  };

  return (
    <>
      <div className="group relative h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col card-hover">
          {/* Kind Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <span className="mr-2">{getKindIcon(content.type)}</span>
              {getKindLabel(content.type)}
            </div>
          </div>

          {/* Title */}
          <h3 className="heading-3 text-foreground mb-4 group-hover:text-primary transition-colors duration-200">
            {content.title}
          </h3>

          {/* Description */}
          <p className="body-regular text-muted-foreground mb-6 flex-grow">
            {content.description}
          </p>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <div className="w-6 h-6 bg-accent/50 rounded-lg flex items-center justify-center">
              <Clock className="w-3 h-3" />
            </div>
            <span className="font-medium">{content.duration || 15} dakika</span>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartClick}
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 font-semibold mt-auto active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              Başla
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Content Display Modal */}
      {showModal && (
        <ContentDisplayModal
          open={showModal}
          onClose={() => setShowModal(false)}
          content={content} // Content objesini modala iletiyorum
        />
      )}
    </>
  );
}
