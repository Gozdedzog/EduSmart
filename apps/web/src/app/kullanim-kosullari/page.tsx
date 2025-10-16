export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* Spacer for fixed navbar */}
      <div className="h-14" />
      
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">
              Kullanım Koşulları
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-5xl mx-auto leading-relaxed">
            Platformumuzu kullanmadan önce lütfen bu koşulları dikkatlice okuyun.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="space-y-8">
            {/* Hizmetin Tanımı */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Hizmetin Tanımı</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu, kullanıcılara yapay zekâ destekli kişiselleştirilmiş eğitim içerikleri sunan bir web platformudur. Bu hizmet, olduğu gibi sunulmakta olup, içeriklerin doğruluğu veya eksiksizliği konusunda garanti verilmemektedir.
                </p>
              </div>
            </div>

            {/* Kullanıcı Sorumlulukları */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Kullanıcı Sorumlulukları</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Kullanıcılar, hesap bilgilerinin gizliliğinden sorumludur. Platformu yasa dışı veya etik olmayan amaçlarla kullanmak kesinlikle yasaktır. Fikri mülkiyet haklarına saygı göstermeli ve platform içeriğini izinsiz kopyalamamalısınız.
                </p>
              </div>
            </div>

            {/* Hizmetin Sonlandırılması */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Hizmetin Sonlandırılması</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Kullanım koşullarına aykırı davranışlar sergileyen kullanıcıların hesapları, önceden haber verilmeksizin askıya alınabilir veya sonlandırılabilir.
                </p>
              </div>
            </div>

            {/* Fikri Mülkiyet */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Fikri Mülkiyet Hakları</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Platform üzerindeki tüm içerikler, telif hakkı ve diğer fikri mülkiyet yasaları ile korunmaktadır. İçerikleri izinsiz kopyalamak, dağıtmak veya ticari amaçlarla kullanmak yasaktır.
                </p>
              </div>
            </div>

            {/* Sorumluluk Sınırları */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Sorumluluk Sınırları</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Platform, hizmetlerin kesintisiz olarak sunulacağını garanti etmez. Teknik arızalar, bakım çalışmaları veya diğer nedenlerle hizmet geçici olarak kesintiye uğrayabilir.
                </p>
              </div>
            </div>

            {/* Değişiklikler */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Koşullarda Değişiklik</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Bu kullanım koşulları, önceden haber verilmeksizin değiştirilebilir. Değişiklikler platform üzerinde yayınlandığı tarihten itibaren geçerli olur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
