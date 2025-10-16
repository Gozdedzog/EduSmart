"""
EduSmart API - Main Application Entry Point
Professional FastAPI application for personalized learning platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from contextlib import asynccontextmanager

from .api.v1 import api_router
from .core.config import settings
from .core.logging import setup_logging
from .core.exceptions import setup_exception_handlers

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting EduSmart API...")
    yield
    # Shutdown
    logger.info("Shutting down EduSmart API...")


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title="EduSmart API",
        description="Professional AI-powered personalized learning platform API",
        version="1.0.0",
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
        openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
        lifespan=lifespan
    )

    # Add middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Tüm origin'lere izin ver
        allow_credentials=True,
        allow_methods=["*"],  # Tüm method'lara izin ver
        allow_headers=["*"],  # Tüm header'lara izin ver
    )

    # Setup exception handlers
    setup_exception_handlers(app)

    # Include API routes
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/")
    async def root():
        return {
            "message": "EduSmart API",
            "version": "1.0.0",
            "status": "healthy",
            "environment": settings.ENVIRONMENT
        }

    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0"
        }

    return app


# Create the application instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )
