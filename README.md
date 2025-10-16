# 🎓 EduSmart - AI-Powered Personalized Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://docker.com/)

**EduSmart** is a professional, enterprise-grade AI-powered personalized learning platform that analyzes individual learning behaviors and provides customized content recommendations using advanced machine learning algorithms.

## 🌟 Key Features

- **🤖 AI-Powered Analysis**: Advanced Logistic Regression-based learning style prediction with comprehensive feature analysis
- **🎯 Personalized Content**: Customized learning recommendations based on individual preferences and performance metrics
- **📊 Comprehensive Testing**: 60-question assessment system (30 video + 30 text questions) with time tracking and difficulty analysis
- **📈 Progress Tracking**: Detailed analytics and performance monitoring
- **🔐 Enterprise Security**: Professional authentication and authorization system
- **🐳 Docker Ready**: Complete containerization for easy deployment
- **📱 Responsive Design**: Modern, mobile-first user interface
- **⚡ High Performance**: Optimized for speed and scalability

## 🏗️ Architecture

### Frontend (Next.js 15.5.2)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Context + Hooks
- **Authentication**: Hybrid (Supabase + Local Database)

### Backend (Python FastAPI)
- **Framework**: FastAPI with async support
- **ML Engine**: Scikit-learn Logistic Regression model
- **API**: RESTful with OpenAPI documentation
- **Security**: CORS, validation, error handling

### Machine Learning
- **Algorithm**: Logistic Regression with Pipeline
- **Features**: 77 (age + gender + 60 test answers + time metrics + difficulty levels + efficiency scores)
- **Classes**: Video, Text, Equal learning styles
- **Advanced Features**: Time tracking, difficulty analysis, efficiency calculations
- **Model**: `best_learning_model_full.joblib` with comprehensive feature engineering

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.11+
- **Docker** (optional)
- **pnpm** (recommended)

### Option 1: Automated Setup

```bash
# Clone the repository
git clone <repository-url>
cd edu_smart

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option 2: Manual Setup

#### 1. Environment Setup
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

#### 2. Frontend Setup
```bash
cd apps/web
pnpm install
pnpm dev
# Frontend: http://localhost:3000
```

#### 3. Backend Setup
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
# Backend: http://localhost:8000
```

### Option 3: Docker Setup

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

## 📁 Project Structure

```
edu_smart/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   ├── lib/          # Utilities and services
│   │   │   └── context/      # React context providers
│   │   ├── Dockerfile
│   │   └── package.json
│   └── api/                   # FastAPI Backend
│       ├── src/
│       │   ├── main.py       # Application entry point
│       │   ├── core/         # Core functionality
│       │   ├── api/          # API routes
│       │   ├── schemas/      # Pydantic schemas
│       │   └── services/     # Business logic
│       ├── Dockerfile
│       └── requirements.txt
├── data/                      # ML models and datasets
│   ├── best_learning_model_full.joblib    # Main ML model (77 features)
│   ├── best_learning_model_full_summary.joblib  # Summary model
│   ├── learning_dataset_30v30_realistic.csv    # Training dataset
│   └── *.json                 # User data and test results
├── models/                    # ML training and analysis scripts
│   ├── prediction_api.py      # Standalone prediction API
│   ├── featureselection_train_demo_model.py  # Model training
│   ├── overfitting_analysis.py  # Model analysis
│   ├── dataset.py             # Dataset generation
│   └── requirements.txt       # ML dependencies
├── docs/                      # Documentation
│   ├── auth-setup.md          # Authentication setup guide
│   ├── auth-smoke-test.md     # Auth testing guide
│   ├── egitim-listesi.md      # Education content list
│   └── test-listesi.md        # Test content list
├── scripts/                   # Setup and utility scripts
│   ├── setup.sh              # Automated setup script
│   ├── check-localStorage.html  # Local storage checker
│   └── check-test-results.html  # Test results checker
├── config/                    # Configuration templates
│   └── env.example           # Environment variables template
├── docker-compose.yml         # Production Docker setup
├── docker-compose.dev.yml     # Development Docker setup
├── CHANGELOG.md              # Project changelog
├── PROJECT_SUMMARY.md        # Project summary
├── SETUP.md                  # Setup guide
├── DEPLOYMENT.md             # Deployment guide
├── CONTRIBUTING.md           # Contributing guidelines
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `development` |
| `NEXT_PUBLIC_ML_API_URL` | ML API URL | `http://localhost:8000` |
| `ENVIRONMENT` | API environment | `development` |
| `ML_MODEL_PATH` | Path to ML model | `./data/best_learning_model_full.joblib` |
| `LOG_LEVEL` | Logging level | `INFO` |

### API Endpoints

#### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health check
- `GET /api/v1/health/` - API health check

#### Machine Learning
- `GET /api/v1/ml/model-info` - Get ML model information
- `POST /api/v1/ml/predict` - Predict learning style
- `GET /api/v1/ml/health` - ML service health check

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
pnpm test
pnpm test:coverage
```

### Backend Testing
```bash
cd apps/api
source venv/bin/activate
pytest
pytest --cov=src
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale web=3
```

### Manual Deployment

1. **Build Frontend**
   ```bash
   cd apps/web
   pnpm build
   pnpm start
   ```

2. **Run Backend**
   ```bash
   cd apps/api
   source venv/bin/activate
   uvicorn src.main:app --host 0.0.0.0 --port 8000
   ```

### Production Considerations

- Set `NODE_ENV=production`
- Set `ENVIRONMENT=production`
- Configure proper CORS origins
- Set up SSL certificates
- Configure reverse proxy (Nginx)
- Set up monitoring and logging
- Configure database (if needed)

## 📈 Performance

- **Frontend**: Optimized with Next.js 15, code splitting, and image optimization
- **Backend**: Async FastAPI with efficient ML model loading
- **ML Predictions**: <100ms response time
- **Docker**: Multi-stage builds for minimal image size

## 🔒 Security

- **CORS**: Configurable cross-origin resource sharing
- **Validation**: Comprehensive input validation with Pydantic
- **Error Handling**: Secure error responses without sensitive data
- **Headers**: Security headers for XSS and clickjacking protection
- **Authentication**: Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` endpoint when running
- **Issues**: Create an issue in the repository
- **Email**: [support@edusmart.com](mailto:support@edusmart.com)

## 🎯 Roadmap

- [ ] Real-time behavior analysis
- [ ] Advanced ML models (Neural Networks)
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with LMS systems

## 🙏 Acknowledgments

- **FastAPI** team for the excellent framework
- **Next.js** team for the amazing React framework
- **Scikit-learn** team for ML tools
- **Radix UI** for accessible components

---

**Built with ❤️ by the EduSmart Team**

*Empowering education through artificial intelligence*