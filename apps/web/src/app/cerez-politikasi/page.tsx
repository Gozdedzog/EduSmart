import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, Shield, Info } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Çerez Politikası
          </h1>
          <p className="text-xl text-gray-600">
            Web sitemizde çerezlerin nasıl kullanıldığını öğrenin.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Cookie className="w-6 h-6 text-orange-600"/>
                <span>Çerez Nedir?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Çerezler, web sitelerinin bilgisayarınızda veya mobil cihazınızda sakladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını sağlar ve kullanıcı deneyimini iyileştirir.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Settings className="w-6 h-6 text-blue-600"/>
                <span>Kullandığımız Çerez Türleri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Zorunlu Çerezler</h4>
                <p>Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezlerdir. Bu çerezler olmadan site düzgün çalışmaz.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Analitik Çerezler</h4>
                <p>Site kullanımını analiz etmek ve performansı iyileştirmek için kullanılan çerezlerdir.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fonksiyonel Çerezler</h4>
                <p>Kullanıcı tercihlerini hatırlamak ve kişiselleştirilmiş deneyim sunmak için kullanılan çerezlerdir.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Shield className="w-6 h-6 text-green-600"/>
                <span>Çerez Yönetimi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Tarayıcınızın ayarlarından çerezleri yönetebilirsiniz. Ancak, bazı çerezleri devre dışı bırakmanız web sitesinin işlevselliğini etkileyebilir. Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Info className="w-6 h-6 text-purple-600"/>
                <span>Daha Fazla Bilgi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Çerez politikamız hakkında daha fazla bilgi almak için bizimle iletişime geçebilirsiniz. Bu politika gerektiğinde güncellenebilir ve değişiklikler web sitesinde yayınlanacaktır.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
