# EduSmart API - Professional Dockerfile
# Multi-architecture support
FROM --platform=$BUILDPLATFORM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Application environment variables
ENV ENVIRONMENT=production \
    DEBUG=false \
    ML_MODEL_PATH=./data/best_learning_model_full.joblib \
    LOG_LEVEL=WARNING \
    SECRET_KEY=your-super-secure-secret-key-here \
    ALLOWED_ORIGINS='["http://localhost:3000","https://localhost:3000","http://localhost:3001","https://localhost:3001"]' \
    ALLOWED_HOSTS='["*"]' \
    API_V1_STR="/api/v1" \
    PROJECT_NAME="EduSmart API" \
    VERSION="1.0.0" \
    ACCESS_TOKEN_EXPIRE_MINUTES=30

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Copy ML model and data files
COPY data/ ./data/

# Create necessary directories
RUN mkdir -p logs data && chown -R app:app logs data

# Switch to non-root user
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]