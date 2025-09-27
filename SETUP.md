# 🚀 EduSmart Kurulum Rehberi

Bu rehber, EduSmart projesini yerel ortamınızda çalıştırmak için gerekli adımları içerir.

## 📋 Gereksinimler

### Sistem Gereksinimleri
- **Node.js**: 18.0.0 veya üzeri
- **Python**: 3.11 veya üzeri
- **pnpm**: 8.0.0 veya üzeri
- **Git**: En son sürüm

### Kontrol Komutları
```bash
# Node.js sürümünü kontrol et
node --version

# Python sürümünü kontrol et
python --version

# pnpm sürümünü kontrol et
pnpm --version
```

## 🔧 Kurulum Adımları

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd edusmart_27_09
```

### 2. Python Backend Kurulumu
```bash
# Python sanal ortamı oluştur (önerilen)
python -m venv venv

# Sanal ortamı aktifleştir
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Python bağımlılıklarını yükle
pip install -r requirements.txt

# ML modelini eğit (isteğe bağlı)
python train_demo_model.py

# ML API servisini başlat
python prediction_api.py
```

### 3. Frontend Kurulumu
```bash
# Ana dizinde pnpm bağımlılıklarını yükle
pnpm install

# Web uygulamasını başlat
pnpm dev
```

### 4. Servisleri Kontrol Et
- **ML API**: http://localhost:8000
- **Web App**: http://localhost:3000

## 🧪 Test Etme

### ML API Testi
```bash
# API sağlık kontrolü
curl http://localhost:8000/health

# Model bilgileri
curl http://localhost:8000/model-info

# Tahmin testi
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 20,
    "gender": "M",
    "video_answers": [1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0],
    "text_answers": [0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1]
  }'
```

### Web Uygulaması Testi
1. http://localhost:3000 adresine gidin
2. Testleri çözün
3. Dashboard'da ML model sonuçlarını kontrol edin

## 🔧 Sorun Giderme

### Python Sorunları
```bash
# Sanal ortamı yeniden oluştur
rm -rf venv
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### Node.js Sorunları
```bash
# node_modules'ı temizle
pnpm clean

# Bağımlılıkları yeniden yükle
pnpm install
```

### Port Çakışması
```bash
# Port 8000 kullanımda ise
lsof -i :8000
kill -9 <PID>

# Port 3000 kullanımda ise
lsof -i :3000
kill -9 <PID>
```

## 📁 Proje Yapısı

```
edusmart_27_09/
├── apps/
│   └── web/              # Next.js frontend
├── prediction_api.py    # ML API servisi
├── train_demo_model.py  # Model eğitimi
├── requirements.txt     # Python bağımlılıkları
├── package.json         # Node.js bağımlılıkları
└── README.md           # Proje dokümantasyonu
```

## 🎯 Hızlı Başlangıç

```bash
# 1. Projeyi klonla
git clone <repository-url>
cd edusmart_27_09

# 2. Python kurulumu
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Node.js kurulumu
pnpm install

# 4. Servisleri başlat
# Terminal 1: ML API
python prediction_api.py

# Terminal 2: Web App
pnpm dev
```

## 📞 Destek

Sorun yaşarsanız:
1. README.md dosyasını kontrol edin
2. Gereksinimlerin karşılandığından emin olun
3. Log dosyalarını kontrol edin
4. GitHub Issues'da sorun bildirin

---

**Not**: Bu proje eğitim amaçlı geliştirilmiştir. Üretim ortamında kullanım için ek güvenlik ve performans optimizasyonları gerekebilir.
