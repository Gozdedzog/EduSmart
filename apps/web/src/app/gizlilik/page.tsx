export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* Spacer for fixed navbar */}
      <div className="h-14" />
      
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">
              Gizlilik Politikası
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-5xl mx-auto leading-relaxed">
            Verilerinizin güvenliği ve gizliliği bizim için en önemli önceliktir.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="space-y-8">
            {/* Toplanan Veriler */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Toplanan Veriler</span>
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>Hizmetlerimizi iyileştirmek amacıyla aşağıdaki verileri topluyoruz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Kayıt Bilgileri:</strong> Ad, e-posta adresi gibi temel kullanıcı bilgileri.</li>
                  <li><strong>Öğrenme Verileri:</strong> Hangi içeriklerde ne kadar zaman geçirdiğiniz, içerik tamamlama oranlarınız ve test sonuçlarınız.</li>
                  <li><strong>Teknik Veriler:</strong> Cihaz türü, tarayıcı bilgileri gibi anonimleştirilmiş veriler.</li>
                </ul>
              </div>
            </div>

            {/* Verilerin Kullanımı */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Verilerin Kullanımı</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Toplanan veriler, platformu kişiselleştirmek, size özel içerik önerileri sunmak ve hizmet kalitemizi artırmak için kullanılır. Verileriniz hiçbir şekilde üçüncü partilerle ticari amaçlarla paylaşılmaz.
                </p>
              </div>
            </div>

            {/* Veri Güvenliği */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Veri Güvenliği</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Verilerinizi yetkisiz erişime, değişikliğe veya ifşaya karşı korumak için endüstri standardı güvenlik önlemleri alıyoruz. Tüm veri aktarımları SSL ile şifrelenmektedir.
                </p>
              </div>
            </div>

            {/* Veri Saklama */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Veri Saklama Süresi</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  Kişisel verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmeniz durumunda, verileriniz 30 gün içinde güvenli bir şekilde silinir.
                </p>
              </div>
            </div>

            {/* Kullanıcı Hakları */}
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Kullanıcı Hakları</span>
              </h2>
              <div className="text-slate-700 leading-relaxed">
                <p>
                  KVKK kapsamında verilerinize erişim, düzeltme, silme ve taşınabilirlik haklarınız bulunmaktadır. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
