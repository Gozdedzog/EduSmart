#!/usr/bin/env python3
"""
Kişiselleştirilmiş Öğrenme Platformu - ML Model Prediction API
FastAPI ile öğrenme tercihi tahmin sistemi
"""

import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import logging

# Logging ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI uygulaması
app = FastAPI(
    title="Learning Style Prediction API",
    description="Öğrenme tercihi tahmin sistemi",
    version="1.0.0"
)

# CORS middleware ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm origin'lere izin ver
    allow_credentials=True,
    allow_methods=["*"],  # Tüm HTTP metodlarına izin ver
    allow_headers=["*"],  # Tüm header'lara izin ver
)

# Model ve encoder'ları yükle
try:
    model = joblib.load("best_learning_model_optimized.joblib")
    logger.info("Model başarıyla yüklendi")
except Exception as e:
    logger.error(f"Model yükleme hatası: {e}")
    model = None

# Pydantic modelleri
class TestResults(BaseModel):
    """Test sonuçları için veri modeli"""
    age: int
    gender: str  # "M" veya "F"
    video_answers: List[int]  # 30 video sorusu (0 veya 1)
    text_answers: List[int]   # 30 text sorusu (0 veya 1)
    
    class Config:
        schema_extra = {
            "example": {
                "age": 19,
                "gender": "M",
                "video_answers": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
                "text_answers": [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1]
            }
        }

class PredictionResponse(BaseModel):
    """Tahmin sonucu için veri modeli"""
    predicted_style: str  # "video", "text", "equal"
    confidence: float
    video_score: int
    text_score: int
    video_percentage: float
    text_percentage: float
    recommendation: Dict[str, Any]
    
    class Config:
        schema_extra = {
            "example": {
                "predicted_style": "video",
                "confidence": 0.85,
                "video_score": 18,
                "text_score": 12,
                "video_percentage": 60.0,
                "text_percentage": 40.0,
                "recommendation": {
                    "content_ratio": {"video": 70, "text": 30},
                    "learning_tips": ["Video içerikleri tercih edin", "Görsel öğrenme materyalleri kullanın"],
                    "study_method": "Görsel öğrenme"
                }
            }
        }

def prepare_features(age: int, gender: str, video_answers: List[int], text_answers: List[int]) -> pd.DataFrame:
    """Test sonuçlarını model için hazırla"""
    try:
        # Test sonuçları
        all_answers = video_answers + text_answers
        
        # DataFrame oluştur - gender string olarak kalmalı
        columns = ["age", "gender"] + [f"video_q{i+1}" for i in range(30)] + [f"text_q{i+1}" for i in range(30)]
        data = [age, gender] + all_answers
        
        df = pd.DataFrame([data], columns=columns)
        
        return df
    except Exception as e:
        logger.error(f"Özellik hazırlama hatası: {e}")
        raise HTTPException(status_code=400, detail=f"Özellik hazırlama hatası: {e}")

def calculate_recommendations(predicted_style: str, video_score: int, text_score: int) -> Dict[str, Any]:
    """Kişiselleştirilmiş öneriler hesapla"""
    total_score = video_score + text_score
    
    if predicted_style == "video":
        content_ratio = {"video": 70, "text": 30}
        learning_tips = [
            "Video içerikleri tercih edin",
            "Görsel öğrenme materyalleri kullanın",
            "Animasyonlu içerikleri seçin",
            "Video dersleri izleyin"
        ]
        study_method = "Görsel öğrenme"
        
    elif predicted_style == "text":
        content_ratio = {"video": 30, "text": 70}
        learning_tips = [
            "Yazılı materyalleri tercih edin",
            "Kitap ve makale okuyun",
            "Not tutma alışkanlığı edinin",
            "Yazılı özetler hazırlayın"
        ]
        study_method = "Yazılı öğrenme"
        
    else:  # equal
        content_ratio = {"video": 50, "text": 50}
        learning_tips = [
            "Hibrit öğrenme yöntemi kullanın",
            "Hem video hem yazılı içerik tercih edin",
            "Çeşitli öğrenme materyalleri deneyin",
            "Karma öğrenme stratejisi uygulayın"
        ]
        study_method = "Karma öğrenme"
    
    return {
        "content_ratio": content_ratio,
        "learning_tips": learning_tips,
        "study_method": study_method
    }

@app.get("/")
async def root():
    """Ana sayfa"""
    return {
        "message": "Kişiselleştirilmiş Öğrenme Platformu API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    """Sağlık kontrolü"""
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_learning_style(test_results: TestResults):
    """Öğrenme tercihi tahmin et"""
    
    if model is None:
        raise HTTPException(status_code=500, detail="Model yüklenemedi")
    
    try:
        # Veri doğrulama
        if len(test_results.video_answers) != 30:
            raise HTTPException(status_code=400, detail="Video cevapları 30 adet olmalı")
        
        if len(test_results.text_answers) != 30:
            raise HTTPException(status_code=400, detail="Text cevapları 30 adet olmalı")
        
        if test_results.gender.upper() not in ["M", "F"]:
            raise HTTPException(status_code=400, detail="Cinsiyet M veya F olmalı")
        
        # Özellikleri hazırla
        features = prepare_features(
            test_results.age,
            test_results.gender,
            test_results.video_answers,
            test_results.text_answers
        )
        
        # Tahmin yap
        prediction = model.predict(features)[0]
        prediction_proba = model.predict_proba(features)[0]
        
        # Sınıf etiketleri
        class_labels = ["equal", "text", "video"]
        predicted_style = class_labels[prediction]
        confidence = float(np.max(prediction_proba))
        
        # Skorları hesapla
        video_score = sum(test_results.video_answers)
        text_score = sum(test_results.text_answers)
        total_score = video_score + text_score
        
        video_percentage = (video_score / 30) * 100 if total_score > 0 else 0
        text_percentage = (text_score / 30) * 100 if total_score > 0 else 0
        
        # Önerileri hesapla
        recommendation = calculate_recommendations(predicted_style, video_score, text_score)
        
        logger.info(f"Tahmin tamamlandı: {predicted_style} (güven: {confidence:.3f})")
        
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
async def get_model_info():
    """Model bilgilerini getir"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model yüklenemedi")
    
    return {
        "model_type": "SVM",
        "accuracy": "100%",
        "classes": ["equal", "text", "video"],
        "features": 62,  # age + gender + 30 video + 30 text
        "status": "ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
