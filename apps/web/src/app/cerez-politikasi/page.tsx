export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* Spacer for fixed navbar */}
      <div className="h-14" />
      
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">
              Çerez Politikası
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-5xl mx-auto leading-relaxed">
            Web sitemizde çerezlerin nasıl kullanıldığını ve yönetildiğini öğrenin.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="space-y-8">
            {/* Çerez Nedir? */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Çerez Nedir?</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Çerezler, web sitelerinin bilgisayarınızda veya mobil cihazınızda sakladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını sağlar ve kullanıcı deneyimini iyileştirir.
                </p>
              </div>
            </div>

            {/* Kullandığımız Çerez Türleri */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Kullandığımız Çerez Türleri</span>
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Zorunlu Çerezler</h4>
                  <p>Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezlerdir. Bu çerezler olmadan site düzgün çalışmaz.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Analitik Çerezler</h4>
                  <p>Site kullanımını analiz etmek ve performansı iyileştirmek için kullanılan çerezlerdir.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Fonksiyonel Çerezler</h4>
                  <p>Kullanıcı tercihlerini hatırlamak ve kişiselleştirilmiş deneyim sunmak için kullanılan çerezlerdir.</p>
                </div>
              </div>
            </div>

            {/* Çerez Yönetimi */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Çerez Yönetimi</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Tarayıcınızın ayarlarından çerezleri yönetebilirsiniz. Ancak, bazı çerezleri devre dışı bırakmanız web sitesinin işlevselliğini etkileyebilir. Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
                </p>
              </div>
            </div>

            {/* Çerez Süreleri */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Çerez Süreleri</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Çerezlerimiz farklı sürelerde saklanır. Oturum çerezleri tarayıcı kapatıldığında silinirken, kalıcı çerezler belirli bir süre boyunca cihazınızda kalır.
                </p>
              </div>
            </div>

            {/* Üçüncü Taraf Çerezler */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Üçüncü Taraf Çerezler</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Platformumuzda analitik ve performans ölçümü için üçüncü taraf hizmetler kullanılmaktadır. Bu hizmetlerin çerez politikaları kendi web sitelerinde yayınlanmaktadır.
                </p>
              </div>
            </div>

            {/* Daha Fazla Bilgi */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Daha Fazla Bilgi</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Çerez politikamız hakkında daha fazla bilgi almak için bizimle iletişime geçebilirsiniz. Bu politika gerektiğinde güncellenebilir ve değişiklikler web sitesinde yayınlanacaktır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
