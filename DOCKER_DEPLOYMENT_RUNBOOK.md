# EduSmart Docker Deployment Runbook

## Prerequisites
- Docker and Docker Compose installed
- Docker Hub account with access to push to `gozdedzog/` namespace
- Optional: `.env` file with required environment variables (Supabase keys, etc.)
  - If you have a `.env` file, uncomment the `env_file` sections in docker-compose.yml
  - If not, the services will use the default environment variables from the Dockerfiles

## Quick Start Commands

### 1. Build Images (if needed)
```bash
# Build web image
cd apps/web && docker build -t gozdedzog/edusmart-web:latest .

# Build API image  
cd apps/api && docker build -t gozdedzog/edusmart-api:latest .
```

### 2. Start Services
```bash
# Start all services in detached mode
docker compose up -d

# View logs (optional)
docker compose logs -f
```

### 3. Verify Deployment
```bash
# Check API health
curl -f http://localhost:8000/health

# Open web application
open http://localhost:3000
# OR manually navigate to: http://localhost:3000
```

### 4. Push Images to Docker Hub
```bash
# Login to Docker Hub
docker login

# Push images
docker push gozdedzog/edusmart-web:latest
docker push gozdedzog/edusmart-api:latest
```

## Service Details

### API Service
- **Image**: `gozdedzog/edusmart-api:latest`
- **Port**: `8000:8000`
- **Health Check**: `http://localhost:8000/health`
- **Dependencies**: None (starts first)

### Web Service  
- **Image**: `gozdedzog/edusmart-web:latest`
- **Port**: `3000:3000`
- **Health Check**: `http://localhost:3000`
- **Dependencies**: Waits for API to be healthy

## Environment Variables
The services can load environment variables from a `.env` file (if you uncomment the env_file sections in docker-compose.yml). Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`

If no `.env` file is provided, the services will use the default environment variables from the Dockerfiles.

## Troubleshooting

### Check Service Status
```bash
docker compose ps
```

### View Service Logs
```bash
# All services
docker compose logs

# Specific service
docker compose logs api
docker compose logs web
```

### Restart Services
```bash
docker compose restart
```

### Stop Services
```bash
docker compose down
```

### Clean Up
```bash
# Stop and remove containers, networks
docker compose down

# Remove images (optional)
docker rmi gozdedzog/edusmart-web:latest gozdedzog/edusmart-api:latest
```
