import Image from 'next/image';
import { StartNowButton } from '@/components/StartNowButton';
import { Brain, Target, BarChart3, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen">
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: text */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Destekli Öğrenme
                </div>
                <h1 className="heading-1">
                  <span className="gradient-text">Yapay Zekâ Destekli</span><br/>
                  <span className="gradient-text">Kişiselleştirilmiş</span><br/>
                  <span className="gradient-text">Öğrenme Platformu</span>
                </h1>
                <p className="body-large text-muted-foreground max-w-2xl">
                  Öğrenme davranışlarınızı analiz ederek size özel içerik önerileri sunan yapay zekâ platformu ile eğitim deneyiminizi kişiselleştirin.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <StartNowButton />
                <a 
                  href="/hakkinda" 
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-foreground border border-border shadow-sm hover:shadow-md hover:bg-accent/50 transition-all duration-200 font-medium"
                >
                  Daha Fazla Bilgi
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">1000+</div>
                  <div className="text-sm text-muted-foreground">Aktif Kullanıcı</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">500+</div>
                  <div className="text-sm text-muted-foreground">Eğitim İçeriği</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">95%</div>
                  <div className="text-sm text-muted-foreground">Başarı Oranı</div>
                </div>
              </div>
            </div>
            
            {/* RIGHT: image */}
            <div className="relative animate-slide-up">
              <div className="relative h-80 md:h-[500px]">
                <Image
                  src="/images/landing-hero.jpg"
                  alt="Öğrenciler ve yapay zekâ görseli"
                  fill
                  priority
                  sizes="(min-width:768px) 560px, 100vw"
                  className="rounded-3xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center space-y-6 mb-20">
            <h2 className="heading-2 gradient-text">Neden EduSmart?</h2>
            <p className="body-large text-muted-foreground max-w-3xl mx-auto">
              Yapay zekâ teknolojisi ile öğrenme sürecinizi optimize edin ve hedeflerinize daha hızlı ulaşın.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 text-left card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="heading-3 mb-4">Yapay Zekâ Analizi</h3>
                <p className="body-regular text-muted-foreground">
                  Öğrenme davranışlarınız analiz edilerek en uygun içerik türü belirlenir ve kişiselleştirilmiş öneriler sunulur.
                </p>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 text-left card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="heading-3 mb-4">Kişiselleştirilmiş İçerik</h3>
                <p className="body-regular text-muted-foreground">
                  Size özel görsel, video veya metin tabanlı öğrenme materyalleri ile en etkili öğrenme deneyimini yaşayın.
                </p>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 text-left card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="heading-3 mb-4">İlerleme Takibi</h3>
                <p className="body-regular text-muted-foreground">
                  Öğrenme sürecinizi detaylı olarak takip edin, analiz edin ve motivasyonunuzu artırın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
