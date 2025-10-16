"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from typing import Dict, Any
import logging

from ....services.ml_service import MLService, get_ml_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=Dict[str, Any])
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "EduSmart API",
        "version": "1.0.0"
    }


@router.get("/detailed", response_model=Dict[str, Any])
async def detailed_health_check(ml_service: MLService = Depends(get_ml_service)):
    """Detailed health check with system information"""
    try:
        # Check ML model availability
        model_status = ml_service.is_model_loaded()
        
        return {
            "status": "healthy",
            "service": "EduSmart API",
            "version": "1.0.0",
            "components": {
                "ml_model": "loaded" if model_status else "not_loaded",
                "database": "connected",  # Add actual DB check if needed
                "api": "running"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "EduSmart API",
            "version": "1.0.0",
            "error": str(e)
        }
