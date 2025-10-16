"""
API v1 router configuration
"""

from fastapi import APIRouter
from .endpoints import ml, health

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(ml.router, prefix="/ml", tags=["machine-learning"])
