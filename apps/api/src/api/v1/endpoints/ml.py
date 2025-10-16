"""
Machine Learning endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import logging

from ....schemas.ml_schemas import (
    TestResultsRequest,
    PredictionResponse,
    ModelInfoResponse
)
from ....services.ml_service import MLService, get_ml_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info(ml_service: MLService = Depends(get_ml_service)):
    """Get ML model information"""
    try:
        return await ml_service.get_model_info()
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get model information")


@router.post("/predict", response_model=PredictionResponse)
async def predict_learning_style(
    request: TestResultsRequest,
    ml_service: MLService = Depends(get_ml_service)
):
    """Predict learning style based on test results"""
    try:
        return await ml_service.predict_learning_style(request)
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to make prediction")


@router.get("/health", response_model=Dict[str, Any])
async def ml_health_check(ml_service: MLService = Depends(get_ml_service)):
    """ML service health check"""
    try:
        is_healthy = ml_service.is_model_loaded()
        return {
            "status": "healthy" if is_healthy else "unhealthy",
            "model_loaded": is_healthy,
            "service": "ML Service"
        }
    except Exception as e:
        logger.error(f"ML health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "model_loaded": False,
            "service": "ML Service",
            "error": str(e)
        }
