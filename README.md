# 🎓 EduSmart - Yapay Zeka Destekli Kişiselleştirilmiş Öğrenme Platformu

## 📋 Proje Özeti

**EduSmart**, bireylerin öğrenme süreçlerini daha verimli, etkili ve kalıcı hale getirmek amacıyla geliştirilmiş **yapay zeka destekli kişiselleştirilmiş eğitim sistemidir**. Derin öğrenme algoritmalarından yararlanılarak bireylerin dijital ortamdaki öğrenme davranışları analiz edilir ve her birey için en uygun öğrenme stratejisi belirlenir.

## 🎯 Proje Amacı

- **Kişiselleştirilmiş Öğrenme**: Her bireyin öğrenme tarzına uygun içerik önerileri
- **Yapay Zeka Destekli Analiz**: Kullanıcı davranışlarının derinlemesine analizi
- **Adaptif Sistem**: Zamanla kendini geliştiren ve uyarlayan sistem
- **Verimli Öğrenme**: Öğrenme sürecinin kalıcılığını ve etkinliğini artırma

## 🏗️ Teknik Mimari

### Frontend (Next.js)
- **Framework**: Next.js 15.5.2
- **Dil**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **State Management**: React hooks

### Backend (Python/FastAPI)
- **Framework**: FastAPI
- **ML Framework**: Scikit-learn
- **Model**: SVM (Support Vector Machine)
- **API**: RESTful API
- **CORS**: Cross-Origin Resource Sharing desteği

### Makine Öğrenmesi
- **Model Tipi**: SVM (Support Vector Machine)
- **Doğruluk**: %100 (eğitim verilerinde)
- **Özellik Sayısı**: 62
- **Sınıflar**: ["equal", "text", "video"]
- **Algoritma**: GridSearchCV ile optimize edilmiş

## 🤖 Yapay Zeka Sistemi

### Model Eğitimi
```python
# 5 farklı algoritma test edildi:
- Logistic Regression
- Decision Tree
- Random Forest
- SVM (Seçilen)
- XGBoost
```

### Özellik Mühendisliği
Model **62 özelliği** analiz eder:
- **Demografik**: Yaş, Cinsiyet
- **Video Testi**: 30 soru (0/1 cevaplar)
- **Yazılı Testi**: 30 soru (0/1 cevaplar)

### Tahmin Süreci
1. **Veri Toplama**: Kullanıcı test sonuçları
2. **Ön İşleme**: OneHotEncoder + normalizasyon
3. **Tahmin**: SVM modeli ile sınıflandırma
4. **Sonuç**: Öğrenme stili + güven skoru + öneriler

## 📊 Veri Seti

### Eğitim Verileri
- **Kayıt Sayısı**: 1000+ öğrenci
- **Yaş Aralığı**: 17-20 yaş
- **Cinsiyet Dağılımı**: Eşit dağılım
- **Test Formatı**: 30 video + 30 yazılı sorusu

### Veri Kalitesi
- **Gerçekçi Başarı Oranları**: Video %58, Yazılı %56
- **Belirsizlik Oranı**: %50+ (çok yakın skorlar)
- **Sınıf Dengesi**: Eşit dağılım

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
```bash
# Python 3.11+
# Node.js 18+
# pnpm 8+
```

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd edusmart_27_09
```

### 2. Python Backend Kurulumu
```bash
# ML modeli eğit (isteğe bağlı)
python train_demo_model.py

# API servisini başlat
python prediction_api.py
```

### 3. Frontend Kurulumu
```bash
# Web uygulamasını başlat
cd apps/web
npm install
npm run dev
```

### 4. Servisler
- **ML API**: http://localhost:8000
- **Web App**: http://localhost:3000

## 🔧 API Endpoints

### ML Prediction API
```bash
# Sağlık kontrolü
GET /health

# Model bilgileri
GET /model-info

# Tahmin yapma
POST /predict
{
  "age": 20,
  "gender": "M",
  "video_answers": [1,0,1,1,0,...],
  "text_answers": [0,1,0,0,1,...]
}
```

### Yanıt Formatı
```json
{
  "predicted_style": "video",
  "confidence": 0.99999999999995,
  "video_score": 18,
  "text_score": 12,
  "video_percentage": 60.0,
  "text_percentage": 40.0,
  "recommendation": {
    "content_ratio": {"video": 70, "text": 30},
    "learning_tips": [
      "Video içerikleri tercih edin",
      "Görsel öğrenme materyalleri kullanın"
    ],
    "study_method": "Görsel öğrenme"
  }
}
```

## 🎯 Kullanım Senaryoları

### 1. Öğrenci Testi
- Kullanıcı video ve yazılı testleri çözer
- Sistem otomatik olarak öğrenme stilini belirler
- Kişiselleştirilmiş öneriler sunar

### 2. Eğitim Kurumları
- Toplu öğrenci analizi
- Sınıf bazlı öğrenme stratejileri
- Performans takibi

### 3. Kurumsal Eğitim
- Çalışan gelişim programları
- Kişiselleştirilmiş eğitim yolları
- ROI analizi

## 📈 Model Performansı

### Eğitim Sonuçları
- **Cross-Validation**: 5-fold CV
- **Scoring**: F1-macro
- **GridSearch**: Parametre optimizasyonu
- **Overfitting Kontrolü**: Train vs Test accuracy

### Gerçek Zamanlı Performans
- **Tahmin Süresi**: <100ms
- **Güven Skoru**: 0.0-1.0 arası
- **Doğruluk**: Yüksek güvenilirlik

## 🔍 Özellikler

### ✅ Mevcut Özellikler
- **ML Model Entegrasyonu**: Gerçek SVM modeli
- **Kişiselleştirilmiş Öneriler**: AI destekli içerik önerileri
- **Test Sistemi**: Video ve yazılı testler
- **Dashboard**: Kullanıcı analiz paneli
- **API**: RESTful API servisi

### 🚧 Geliştirme Aşamasında
- **Gerçek Zamanlı Davranış Analizi**: Mouse tracking, scroll behavior
- **Derin Öğrenme**: Neural network modelleri
- **Adaptif Sistem**: Sürekli öğrenen sistem
- **Gelişmiş Öneriler**: Dinamik içerik kişiselleştirmesi

## 🛠️ Geliştirme

### Proje Yapısı
```
edusmart_27_09/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Python backend (scaffold)
├── prediction_api.py     # ML API servisi
├── train_demo_model.py   # Model eğitimi
├── dataset.py           # Veri seti oluşturma
└── requirements.txt     # Python bağımlılıkları
```

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip

- **Proje Sahibi**: Şuheda AKTAŞ
- **Kategori**: Makine Öğrenmesi
- **Teknoloji**: Yapay Zeka, Next.js, Python, FastAPI

## 📞 İletişim

Proje hakkında sorularınız için:
- **Email**: [email protected]
- **GitHub**: [repository-url]

## 🎉 Teşekkürler

Bu proje, modern eğitim teknolojileri ve yapay zeka alanındaki yenilikçi yaklaşımları birleştirerek, kişiselleştirilmiş öğrenme deneyimleri sunmayı hedeflemektedir.

---

**Not**: Bu proje, eğitim amaçlı geliştirilmiştir ve sürekli geliştirme aşamasındadır. Gerçek kullanım için ek güvenlik ve performans optimizasyonları gerekebilir.