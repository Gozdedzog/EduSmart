"""
Exception handlers for EduSmart API
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger(__name__)


class EduSmartException(Exception):
    """Base exception for EduSmart API"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class MLModelException(EduSmartException):
    """ML Model related exceptions"""
    def __init__(self, message: str = "ML Model error"):
        super().__init__(message, 500)


class ValidationException(EduSmartException):
    """Validation related exceptions"""
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, 400)


def setup_exception_handlers(app: FastAPI):
    """Setup global exception handlers"""
    
    @app.exception_handler(EduSmartException)
    async def edusmart_exception_handler(request: Request, exc: EduSmartException):
        logger.error(f"EduSmart Exception: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "EduSmart Error",
                "message": exc.message,
                "status_code": exc.status_code
            }
        )
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.error(f"HTTP Exception: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "HTTP Error",
                "message": exc.detail,
                "status_code": exc.status_code
            }
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.error(f"Validation Error: {exc.errors()}")
        return JSONResponse(
            status_code=422,
            content={
                "error": "Validation Error",
                "message": "Invalid request data",
                "details": exc.errors()
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred"
            }
        )
