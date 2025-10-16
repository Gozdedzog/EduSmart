"""
Pydantic schemas for ML endpoints
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any
from enum import Enum


class GenderEnum(str, Enum):
    """Gender enumeration"""
    MALE = "M"
    FEMALE = "F"


class LearningStyleEnum(str, Enum):
    """Learning style enumeration"""
    VIDEO = "video"
    TEXT = "text"
    EQUAL = "equal"


class TestResultsRequest(BaseModel):
    """Request schema for test results"""
    age: int = Field(..., ge=1, le=100, description="User age")
    gender: GenderEnum = Field(..., description="User gender")
    video_answers: List[int] = Field(..., min_items=30, max_items=30, description="Video test answers (30 questions)")
    text_answers: List[int] = Field(..., min_items=30, max_items=30, description="Text test answers (30 questions)")
    # Süre bilgileri (saniye)
    time_video: float = Field(..., ge=0, description="Time spent on video questions")
    time_text: float = Field(..., ge=0, description="Time spent on text questions")
    time_total: float = Field(..., ge=0, description="Total time spent")
    # Zorluk seviyesi bilgileri
    video_easy: int = Field(..., ge=0, le=30, description="Number of easy video questions answered correctly")
    video_medium: int = Field(..., ge=0, le=30, description="Number of medium video questions answered correctly")
    video_hard: int = Field(..., ge=0, le=30, description="Number of hard video questions answered correctly")
    text_easy: int = Field(..., ge=0, le=30, description="Number of easy text questions answered correctly")
    text_medium: int = Field(..., ge=0, le=30, description="Number of medium text questions answered correctly")
    text_hard: int = Field(..., ge=0, le=30, description="Number of hard text questions answered correctly")
    # Efficiency bilgileri (otomatik hesaplanır)
    efficiency_video: float = Field(..., ge=0, description="Video learning efficiency")
    efficiency_text: float = Field(..., ge=0, description="Text learning efficiency")
    
    @validator('video_answers', 'text_answers')
    def validate_answers(cls, v):
        """Validate that answers are 0 or 1"""
        if not all(answer in [0, 1] for answer in v):
            raise ValueError('All answers must be 0 or 1')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "age": 20,
                "gender": "M",
                "video_answers": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
                "text_answers": [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
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


class Recommendation(BaseModel):
    """Recommendation schema"""
    content_ratio: Dict[str, int] = Field(..., description="Recommended content ratio")
    learning_tips: List[str] = Field(..., description="Learning tips")
    study_method: str = Field(..., description="Recommended study method")


class PredictionResponse(BaseModel):
    """Response schema for learning style prediction"""
    predicted_style: LearningStyleEnum = Field(..., description="Predicted learning style")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Prediction confidence")
    video_score: int = Field(..., ge=0, le=30, description="Video test score")
    text_score: int = Field(..., ge=0, le=30, description="Text test score")
    video_percentage: float = Field(..., ge=0.0, le=100.0, description="Video score percentage")
    text_percentage: float = Field(..., ge=0.0, le=100.0, description="Text score percentage")
    recommendation: Recommendation = Field(..., description="Personalized recommendations")
    
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
                    "learning_tips": [
                        "Video içerikleri tercih edin",
                        "Görsel öğrenme materyalleri kullanın"
                    ],
                    "study_method": "Görsel öğrenme"
                }
            }
        }


class ModelInfoResponse(BaseModel):
    """Response schema for model information"""
    model_type: str = Field(..., description="Type of ML model")
    accuracy: str = Field(..., description="Model accuracy")
    classes: List[str] = Field(..., description="Model classes")
    features: int = Field(..., description="Number of features")
    status: str = Field(..., description="Model status")
    
    class Config:
        schema_extra = {
            "example": {
                "model_type": "SVM",
                "accuracy": "100%",
                "classes": ["equal", "text", "video"],
                "features": 62,
                "status": "ready"
            }
        }
