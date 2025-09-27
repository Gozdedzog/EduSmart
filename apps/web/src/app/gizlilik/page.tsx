import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileText, UserCog } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Gizlilik Politikası
          </h1>
          <p className="text-xl text-gray-600">
            Verilerinizin güvenliği bizim için önemlidir.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <FileText className="w-6 h-6 text-blue-600"/>
                <span>Toplanan Veriler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <p>Hizmetlerimizi iyileştirmek amacıyla aşağıdaki verileri topluyoruz:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Kayıt Bilgileri:</strong> Ad, e-posta adresi gibi temel kullanıcı bilgileri.</li>
                <li><strong>Öğrenme Verileri:</strong> Hangi içeriklerde ne kadar zaman geçirdiğiniz, içerik tamamlama oranlarınız ve test sonuçlarınız.</li>
                <li><strong>Teknik Veriler:</strong> Cihaz türü, tarayıcı bilgileri gibi anonimleştirilmiş veriler.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <UserCog className="w-6 h-6 text-green-600"/>
                <span>Verilerin Kullanımı</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Toplanan veriler, platformu kişiselleştirmek, size özel içerik önerileri sunmak ve hizmet kalitemizi artırmak için kullanılır. Verileriniz hiçbir şekilde üçüncü partilerle ticari amaçlarla paylaşılmaz.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <ShieldCheck className="w-6 h-6 text-purple-600"/>
                <span>Veri Güvenliği</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Verilerinizi yetkisiz erişime, değişikliğe veya ifşaya karşı korumak için endüstri standardı güvenlik önlemleri alıyoruz. Tüm veri aktarımları SSL ile şifrelenmektedir.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
