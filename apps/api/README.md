# EduSmart API

Professional FastAPI backend for the EduSmart personalized learning platform.

## 🚀 Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Advanced ML Integration**: Comprehensive 77-feature Logistic Regression model with time tracking and efficiency analysis
- **Professional Structure**: Clean, maintainable code architecture
- **Docker Support**: Containerized deployment
- **Comprehensive Logging**: Structured logging with file and console output
- **Error Handling**: Global exception handling and validation
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Health Checks**: System and component health monitoring

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── main.py                 # Application entry point
│   ├── core/                   # Core functionality
│   │   ├── config.py          # Configuration management
│   │   ├── logging.py         # Logging setup
│   │   └── exceptions.py      # Exception handlers
│   ├── api/                   # API routes
│   │   └── v1/
│   │       ├── api.py         # API router
│   │       └── endpoints/     # Endpoint implementations
│   ├── schemas/               # Pydantic schemas
│   │   └── ml_schemas.py      # ML-related schemas
│   └── services/              # Business logic
│       └── ml_service.py      # ML service
├── requirements.txt           # Python dependencies
├── Dockerfile                # Container configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🛠️ Development Setup

### Prerequisites

- Python 3.11+
- pip or poetry
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edu_smart/apps/api
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the development server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Development

1. **Build the image**
   ```bash
   docker build -t edusmart-api .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 edusmart-api
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔗 API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health check
- `GET /api/v1/health/` - API health check
- `GET /api/v1/health/detailed` - Detailed API health check

### Machine Learning
- `GET /api/v1/ml/model-info` - Get ML model information
- `POST /api/v1/ml/predict` - Predict learning style
- `GET /api/v1/ml/health` - ML service health check

## 🧪 Testing

Run tests with pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test file
pytest tests/test_ml_service.py
```

## 🔧 Configuration

The API uses environment variables for configuration. See `.env.example` for all available options.

Key configurations:
- `ENVIRONMENT`: development/production
- `DEBUG`: Enable debug mode
- `ALLOWED_ORIGINS`: CORS allowed origins
- `ML_MODEL_PATH`: Path to ML model file
- `LOG_LEVEL`: Logging level

## 📊 Monitoring

The API includes comprehensive logging and health checks:

- **Application logs**: Stored in `logs/api.log`
- **Health endpoints**: Monitor system status
- **Error tracking**: Global exception handling

## 🚀 Deployment

### Docker Deployment

1. **Build production image**
   ```bash
   docker build -t edusmart-api:latest .
   ```

2. **Run with environment variables**
   ```bash
   docker run -d \
     --name edusmart-api \
     -p 8000:8000 \
     -e ENVIRONMENT=production \
     -e SECRET_KEY=your-secret-key \
     edusmart-api:latest
   ```

### Environment Variables for Production

```bash
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secure-secret-key
ALLOWED_ORIGINS=["https://yourdomain.com"]
LOG_LEVEL=WARNING
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation at `/docs` endpoint