import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileBadge, UserCheck, Ban } from 'lucide-react';

export default function Terms() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kullanım Koşulları
          </h1>
          <p className="text-xl text-gray-600">
            Platformumuzu kullanmadan önce lütfen bu koşulları okuyun.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <FileBadge className="w-6 h-6 text-blue-600"/>
                <span>Hizmetin Tanımı</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Yapay Zekâ Destekli Kişiselleştirilmiş Öğrenme Platformu, kullanıcılara yapay zekâ destekli kişiselleştirilmiş eğitim içerikleri sunan bir web platformudur. Bu hizmet, olduğu gibi sunulmakta olup, içeriklerin doğruluğu veya eksiksizliği konusunda garanti verilmemektedir.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <UserCheck className="w-6 h-6 text-green-600"/>
                <span>Kullanıcı Sorumlulukları</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Kullanıcılar, hesap bilgilerinin gizliliğinden sorumludur. Platformu yasa dışı veya etik olmayan amaçlarla kullanmak kesinlikle yasaktır. Fikri mülkiyet haklarına saygı göstermeli ve platform içeriğini izinsiz kopyalamamalısınız.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Ban className="w-6 h-6 text-red-600"/>
                <span>Hizmetin Sonlandırılması</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                Kullanım koşullarına aykırı davranışlar sergileyen kullanıcıların hesapları, önceden haber verilmeksizin askıya alınabilir veya sonlandırılabilir.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
