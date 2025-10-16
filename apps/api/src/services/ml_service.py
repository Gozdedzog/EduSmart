"""
Machine Learning service for EduSmart API
"""

import pandas as pd
import numpy as np
import joblib
import logging
from pathlib import Path
from typing import Optional, Dict, Any
import asyncio

from ..schemas.ml_schemas import (
    TestResultsRequest,
    PredictionResponse,
    ModelInfoResponse,
    Recommendation,
    LearningStyleEnum
)
from ..core.config import settings
from ..core.exceptions import MLModelException

logger = logging.getLogger(__name__)


class MLService:
    """Machine Learning service for learning style prediction"""
    
    def __init__(self):
        self.model: Optional[Any] = None
        self.model_path = Path(settings.ML_MODEL_PATH)
        self._load_model()
    
    def _load_model(self) -> None:
        """Load the ML model"""
        try:
            if self.model_path.exists():
                self.model = joblib.load(self.model_path)
                logger.info("ML model loaded successfully")
            else:
                logger.warning(f"Model file not found at {self.model_path}")
                self.model = None
        except Exception as e:
            logger.error(f"Failed to load ML model: {str(e)}")
            self.model = None
    
    def is_model_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    async def get_model_info(self) -> ModelInfoResponse:
        """Get model information"""
        if not self.is_model_loaded():
            raise MLModelException("ML model is not loaded")
        
        return ModelInfoResponse(
            model_type="LogisticRegression",
            accuracy="94.5%",
            classes=["equal", "text", "video"],
            features=77,  # age + gender + 30 video + 30 text + 3 time + 6 difficulty + 2 efficiency
            status="ready"
        )
    
    def _prepare_features(self, request: TestResultsRequest) -> pd.DataFrame:
        """Prepare features for model prediction"""
        try:
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
                request.age, 
                request.gender.value
            ] + request.video_answers + request.text_answers + [
                request.time_video,
                request.time_text,
                request.time_total,
                request.video_easy,
                request.video_medium,
                request.video_hard,
                request.text_easy,
                request.text_medium,
                request.text_hard,
                request.efficiency_video,
                request.efficiency_text
            ]
            
            df = pd.DataFrame([data], columns=columns)
            return df
        except Exception as e:
            logger.error(f"Error preparing features: {str(e)}")
            raise MLModelException(f"Failed to prepare features: {str(e)}")
    
    def _calculate_recommendations(
        self, 
        predicted_style: str, 
        video_score: int, 
        text_score: int
    ) -> Recommendation:
        """Calculate personalized recommendations"""
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
        
        return Recommendation(
            content_ratio=content_ratio,
            learning_tips=learning_tips,
            study_method=study_method
        )
    
    async def predict_learning_style(self, request: TestResultsRequest) -> PredictionResponse:
        """Predict learning style based on test results"""
        if not self.is_model_loaded():
            raise MLModelException("ML model is not loaded")
        
        try:
            # Prepare features
            features = self._prepare_features(request)
            
            # Make prediction
            prediction = self.model.predict(features)[0]
            prediction_proba = self.model.predict_proba(features)[0]
            
            # Map prediction to enum
            class_labels = ["equal", "text", "video"]
            predicted_style = LearningStyleEnum(class_labels[prediction])
            confidence = float(np.max(prediction_proba))
            
            # Calculate scores
            video_score = sum(request.video_answers)
            text_score = sum(request.text_answers)
            total_score = video_score + text_score
            
            video_percentage = (video_score / 30) * 100 if total_score > 0 else 0
            text_percentage = (text_score / 30) * 100 if total_score > 0 else 0
            
            # Calculate recommendations
            recommendation = self._calculate_recommendations(
                predicted_style.value, video_score, text_score
            )
            
            logger.info(f"Prediction completed: {predicted_style.value} (confidence: {confidence:.3f})")
            
            return PredictionResponse(
                predicted_style=predicted_style,
                confidence=confidence,
                video_score=video_score,
                text_score=text_score,
                video_percentage=video_percentage,
                text_percentage=text_percentage,
                recommendation=recommendation
            )
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            raise MLModelException(f"Failed to make prediction: {str(e)}")


# Dependency injection
_ml_service: Optional[MLService] = None


def get_ml_service() -> MLService:
    """Get ML service instance (singleton)"""
    global _ml_service
    if _ml_service is None:
        _ml_service = MLService()
    return _ml_service
