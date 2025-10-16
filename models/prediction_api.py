#!/usr/bin/env python3
"""
Kişiselleştirilmiş Öğrenme Platformu - ML Model Prediction API
FastAPI ile öğrenme tercihi tahmin sistemi (Pipeline destekli - Profesyonel Sürüm)
"""

import pandas as pd
import numpy as np
import joblib
import logging
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------------------------------------------------------
# Logging ayarları
# -----------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s"
)
logger = logging.getLogger("LearningStyleAPI")

# -----------------------------------------------------------------------------
# FastAPI Uygulaması
# -----------------------------------------------------------------------------
app = FastAPI(
    title="Learning Style Prediction API",
    description="Makine öğrenmesi ile öğrenme tercihi tahmin sistemi (Pipeline destekli)",
    version="2.0.0"
)

# -----------------------------------------------------------------------------
# CORS ayarları
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Model Yükleme
# -----------------------------------------------------------------------------
MODEL_PATH = "../data/best_learning_model_full.joblib"
try:
    model = joblib.load(MODEL_PATH)
    logger.info(f"✅ Model başarıyla yüklendi: {MODEL_PATH}")
except Exception as e:
    logger.error(f"❌ Model yükleme hatası: {e}")
    model = None

# -----------------------------------------------------------------------------
# Veri Modelleri
# -----------------------------------------------------------------------------
class TestResults(BaseModel):
    age: int
    gender: str  # "M" veya "F"
    video_answers: List[int]
    text_answers: List[int]
    # Süre bilgileri (saniye)
    time_video: float
    time_text: float
    time_total: float
    # Zorluk seviyesi bilgileri
    video_easy: int
    video_medium: int
    video_hard: int
    text_easy: int
    text_medium: int
    text_hard: int
    # Efficiency bilgileri (otomatik hesaplanır)
    efficiency_video: float
    efficiency_text: float

    class Config:
        schema_extra = {
            "example": {
                "age": 21,
                "gender": "F",
                "video_answers": [1, 0] * 15,
                "text_answers": [0, 1] * 15,
                "time_video": 1200.5,
                "time_text": 1000.2,
                "time_total": 2200.7,
                "video_easy": 5,
                "video_medium": 8,
                "video_hard": 2,
                "text_easy": 6,
                "text_medium": 7,
                "text_hard": 3,
                "efficiency_video": 0.0125,
                "efficiency_text": 0.0133
            }
        }


class PredictionResponse(BaseModel):
    predicted_style: str
    confidence: float
    video_score: int
    text_score: int
    video_percentage: float
    text_percentage: float
    recommendation: Dict[str, Any]

# -----------------------------------------------------------------------------
# Yardımcı Fonksiyonlar
# -----------------------------------------------------------------------------
def prepare_features(test_results: TestResults) -> pd.DataFrame:
    """
    Kullanıcının test sonuçlarını modelin anlayacağı formata dönüştürür.
    """
    try:
        if len(test_results.video_answers) != 30 or len(test_results.text_answers) != 30:
            raise ValueError("Video ve text cevapları tam olarak 30 adet olmalıdır.")
        
        # Modelin beklediği tüm özellikler
        columns = (
            ["age", "gender"] +
            [f"video_q{i+1}" for i in range(30)] +
            [f"text_q{i+1}" for i in range(30)] +
            ["time_video", "time_text", "time_total"] +
            ["video_easy", "video_medium", "video_hard"] +
            ["text_easy", "text_medium", "text_hard"] +
            ["efficiency_video", "efficiency_text"]
        )
        
        data = [
            test_results.age, 
            test_results.gender.upper()
        ] + test_results.video_answers + test_results.text_answers + [
            test_results.time_video,
            test_results.time_text,
            test_results.time_total,
            test_results.video_easy,
            test_results.video_medium,
            test_results.video_hard,
            test_results.text_easy,
            test_results.text_medium,
            test_results.text_hard,
            test_results.efficiency_video,
            test_results.efficiency_text
        ]
        
        return pd.DataFrame([data], columns=columns)
    except Exception as e:
        logger.error(f"Özellik hazırlama hatası: {e}")
        raise HTTPException(status_code=400, detail=f"Girdi hatası: {e}")

def calculate_recommendations(predicted_style: str) -> Dict[str, Any]:
    """
    Tahmin edilen öğrenme stiline göre kişiselleştirilmiş öneriler oluşturur.
    """
    base_tips = [
        "Dikkat dağıtıcı unsurlardan uzak, sessiz bir ortamda çalışın.",
        "Kısa ama düzenli çalışma seansları planlayın (Pomodoro tekniği önerilir).",
        "Haftalık tekrarlar yaparak bilgiyi pekiştirin.",
        "Öğrendiklerinizi bir başkasına anlatın, öğretmek öğrenmenin en etkili yoludur."
    ]

    if predicted_style == "video":
        return {
            "content_ratio": {"video": 75, "text": 25},
            "study_method": "Görsel & İşitsel Öğrenme",
            "learning_tips": base_tips + [
                "Kısa ve hedef odaklı eğitim videoları izleyin.",
                "Video izlerken aktif notlar alın.",
                "Anlamadığınız yerleri tekrar oynatarak pekiştirin.",
                "Diyagramlar ve animasyonlu anlatımlar kullanın."
            ],
            "recommended_resources": [
                "YouTube eğitim kanalları",
                "MOOC platformları (Coursera, Udemy)",
                "Etkileşimli video dersleri"
            ],
            "motivation_message": "Görsel anlatımlar senin için en etkili yol. Video tabanlı içerikleri öğrenme rutininin merkezine koy."
        }
    elif predicted_style == "text":
        return {
            "content_ratio": {"video": 25, "text": 75},
            "study_method": "Okuma & Yazma Odaklı Öğrenme",
            "learning_tips": base_tips + [
                "Okuduklarınızı özetleyin ve altını çizin.",
                "Her konudan kendi kelimelerinizle kısa özetler yazın.",
                "Not alma uygulamaları (Notion, Obsidian) kullanın.",
                "Okuma sonrası kendinize testler hazırlayın."
            ],
            "recommended_resources": [
                "E-kitaplar, akademik makaleler",
                "Yazılı ders notları",
                "Soru bankaları ve quiz araçları"
            ],
            "motivation_message": "Okuma ve yazma temelli öğrenme sende güçlü. Not alarak, yazarak çalışmak başarını artıracaktır."
        }
    else:
        return {
            "content_ratio": {"video": 50, "text": 50},
            "study_method": "Karma (Hibrit) Öğrenme",
            "learning_tips": base_tips + [
                "Hem video hem yazılı kaynaklardan faydalanın.",
                "Bir konuyu önce videodan öğrenip sonra yazılı özetleyin.",
                "Çeşitli materyallerle tekrar yaparak öğrenmeyi kalıcı hale getirin."
            ],
            "recommended_resources": [
                "Karma öğrenme platformları (Khan Academy, EdX)",
                "Dijital notlar + video ders kombinasyonu"
            ],
            "motivation_message": "Senin için hibrit öğrenme en uygunu. Farklı kaynaklardan beslenerek esnek bir öğrenme yaklaşımı oluştur."
        }

# -----------------------------------------------------------------------------
# API Endpoint'leri
# -----------------------------------------------------------------------------
@app.get("/")
async def root():
    return {"message": "📘 Öğrenme Tercihi Tahmin API - v2.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_learning_style(test_results: TestResults):
    """
    Kullanıcı verilerini alır, makine öğrenmesi modeliyle tahmin yapar
    ve kişiselleştirilmiş öneriler döner.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model yüklenemedi.")

    try:
        features = prepare_features(test_results)

        prediction = model.predict(features)[0]
        proba = model.predict_proba(features)[0]

        # Sınıf isimleri pipeline içindeki sınıflandırıcıdan alınır
        clf = model.named_steps.get("clf", None)
        if clf is None:
            raise ValueError("Pipeline içinde 'clf' adında bir sınıflandırıcı bulunamadı.")
        
        class_labels = list(clf.classes_)
        predicted_style = class_labels[prediction]
        confidence = round(float(np.max(proba)), 3)

        # Skorlar
        video_score = sum(test_results.video_answers)
        text_score = sum(test_results.text_answers)
        video_percentage = round((video_score / 30) * 100, 2)
        text_percentage = round((text_score / 30) * 100, 2)

        recommendation = calculate_recommendations(predicted_style)

        logger.info(f"🎯 Tahmin: {predicted_style} | Güven: {confidence:.2f}")
        return PredictionResponse(
            predicted_style=predicted_style,
            confidence=confidence,
            video_score=video_score,
            text_score=text_score,
            video_percentage=video_percentage,
            text_percentage=text_percentage,
            recommendation=recommendation
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Tahmin hatası: {e}")
        raise HTTPException(status_code=500, detail=f"Tahmin hatası: {e}")

@app.get("/model-info")
async def model_info():
    """
    Modelin teknik bilgilerini döner.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model yüklenemedi.")

    clf = model.named_steps.get("clf", None)
    return {
        "model_type": clf.__class__.__name__ if clf else "Unknown",
        "classes": list(clf.classes_) if clf else [],
        "n_features": len(model.feature_names_in_),
        "status": "ready"
    }

# -----------------------------------------------------------------------------
# Ana Giriş
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
