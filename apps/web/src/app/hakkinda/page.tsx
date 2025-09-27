export default function HakkindaPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* Spacer for fixed navbar */}
      <div className="h-14" />
      
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">
              Hakkımızda
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-5xl mx-auto leading-relaxed">
            Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu ile eğitimin geleceğini şekillendiriyoruz.
          </p>
        </div>
      </section>

      {/* Proje Amacımız Section */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            <span className="gradient-text">Proje Amacımız</span>
          </h2>
          <p className="mt-4 text-slate-700 max-w-3xl mx-auto">
            Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu, her öğrencinin benzersiz öğrenme stiline uygun kişiselleştirilmiş eğitim deneyimi yaşamasını sağlamak amacıyla geliştirilmiştir. Yapay zekâ teknolojisi kullanarak öğrenme davranışlarını analiz eder ve en etkili öğrenme yöntemlerini önerir.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 text-left">
            {/* Card 1 */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Misyonumuz</h3>
              <p className="mt-2 text-slate-600">
                Yapay zekâ destekli kişiselleştirilmiş öğrenme çözümleri ile her öğrencinin potansiyelini maksimize etmek ve eğitime eşitlik sağlamaktır.
              </p>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Vizyonumuz</h3>
              <p className="mt-2 text-slate-600">
                Eğitim teknolojilerinde öncü konumda, kişiselleştirilmiş öğrenme alanında global standartları belirleyen platform olmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platformumuzun Faydaları Section */}
      <section className="py-14 md:py-18 bg-[#F7F8FB]">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold">
              <span className="gradient-text">Platformumuzun Faydaları</span>
            </h2>
            <p className="mt-3 text-slate-600">Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu ile neler kazanacaksınız?</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Card */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Hızlı Öğrenme</h3>
              <p className="mt-2 text-slate-600">Kişiselleştirilmiş içerik önerileri ile %40 daha hızlı öğrenme.</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Artan Motivasyon</h3>
              <p className="mt-2 text-slate-600">İlerleme takibi ve başarı rozetleri ile sürekli motivasyon.</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Akıllı Analiz</h3>
              <p className="mt-2 text-slate-600">Yapay zekâ ile öğrenme paterni analizi ve sürekli iyileştirme.</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Çeşitli İçerik</h3>
              <p className="mt-2 text-slate-600">Görsel, video, metin tabanlı çoklu öğrenme materyalleri.</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Topluluk Desteği</h3>
              <p className="mt-2 text-slate-600">Benzer hedeflere sahip öğrencilerle etkileşim ve paylaşım.</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Sertifikasyon</h3>
              <p className="mt-2 text-slate-600">Başarılarınızı belgeleyen dijital sertifika ve rozetler.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
