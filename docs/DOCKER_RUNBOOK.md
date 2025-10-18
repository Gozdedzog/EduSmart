# EduSmart Docker Runbook

## Overview
This runbook covers Docker deployment for the EduSmart platform with zero data loss and no code changes.

## Services Detected
- **Frontend**: Next.js application in `apps/web/` (Port 3000)
- **Backend**: FastAPI application in `apps/api/` (Port 8000)

## Development Environment

### Prerequisites
- Docker and Docker Compose installed
- Environment files configured (see Environment Configuration section)

### Start Development Environment
```bash
# Start all services with live reload
docker compose -f docker-compose.dev.yml up -d --build

# View logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f web
docker compose -f docker-compose.dev.yml logs -f api
```

### Development Features
- **Live Reload**: Source code changes automatically restart services
- **Bind Mounts**: Source code mounted for real-time development
- **Health Checks**: Automatic service health monitoring
- **Hot Reload**: Frontend and backend support hot reloading

## Production Environment

### Prerequisites
- Docker and Docker Compose installed
- Environment files configured (see Environment Configuration section)
- Data backup completed (if migrating from existing setup)

### Start Production Environment
```bash
# Build and start production services
docker compose up -d --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f web
docker compose logs -f api
```

### Production Features
- **Optimized Images**: Multi-stage builds for smaller images
- **Non-root Users**: Security best practices
- **Health Checks**: Automatic service monitoring
- **Restart Policies**: Automatic service recovery
- **Named Volumes**: Persistent data storage

## Environment Configuration

### Required Environment Files
Create these files in the project root (do NOT commit to git):

#### `.env` (Required)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Configuration
ADMIN_EMAILS=your-admin@email.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ML API Configuration
NEXT_PUBLIC_ML_API_URL=http://localhost:8000

# Backend Configuration
ENVIRONMENT=development
DEBUG=true
ML_MODEL_PATH=./data/best_learning_model_full.joblib
LOG_LEVEL=DEBUG
```

#### `.env.local` (Optional - Next.js specific)
```bash
# Next.js specific environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

## Persistent Data Directories

### Development (Bind Mounts)
| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| `./data/` | `/app/data` (api) | ML models and training data |
| `./apps/api/logs/` | `/app/logs` (api) | API logs |
| `./apps/web/data/` | `/app/data` (web) | Frontend data files |

### Production (Named Volumes)
| Volume Name | Container Path | Purpose |
|-------------|----------------|---------|
| `api_data` | `/app/data` (api) | ML models and training data |
| `api_logs` | `/app/logs` (api) | API logs |
| `web_data` | `/app/data` (web) | Frontend data files |

## Health Check Endpoints

### Frontend (Web)
- **URL**: http://localhost:3000
- **Health Check**: TCP connection to port 3000
- **Expected Response**: Next.js application loads

### Backend (API)
- **URL**: http://localhost:8000/health
- **Health Check**: HTTP GET request
- **Expected Response**: `{"status":"healthy","environment":"development","version":"1.0.0"}`

## Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check service status
docker compose ps

# View detailed logs
docker compose logs [service-name]

# Rebuild services
docker compose up -d --build --force-recreate
```

#### Port Conflicts
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8000

# Stop conflicting services or change ports in docker-compose files
```

#### Data Not Persisting
```bash
# Check volume mounts
docker compose exec web ls -la /app/data
docker compose exec api ls -la /app/data

# Verify volume permissions
docker compose exec web ls -la /app/
docker compose exec api ls -la /app/
```

#### Environment Variables Not Loading
```bash
# Check if .env files exist
ls -la .env*

# Verify environment variables in container
docker compose exec web env | grep NEXT_PUBLIC
docker compose exec api env | grep ENVIRONMENT
```

### Service Management

#### Stop Services
```bash
# Development
docker compose -f docker-compose.dev.yml down

# Production
docker compose down
```

#### Clean Up
```bash
# Remove containers and networks
docker compose down

# Remove containers, networks, and volumes (WARNING: Data loss)
docker compose down -v

# Remove images
docker compose down --rmi all
```

#### Update Services
```bash
# Pull latest images and rebuild
docker compose pull
docker compose up -d --build
```

## Security Notes

- All containers run as non-root users
- Environment files are not committed to git
- Health checks prevent unhealthy containers from serving traffic
- Production images use multi-stage builds for minimal attack surface

## Monitoring

### Service Health
```bash
# Check service health
docker compose ps

# View health check logs
docker compose exec web wget --spider http://localhost:3000
docker compose exec api curl -f http://localhost:8000/health
```

### Resource Usage
```bash
# Monitor resource usage
docker stats

# View container details
docker compose exec web top
docker compose exec api top
```

## Backup and Recovery

### Backup Data
```bash
# Backup named volumes
docker run --rm -v edusmart_web_data:/data -v edusmart_api_data:/api_data -v $(pwd):/backup alpine tar czf /backup/edusmart-backup.tar.gz /data /api_data
```

### Restore Data
```bash
# Restore from backup
docker run --rm -v edusmart_web_data:/data -v edusmart_api_data:/api_data -v $(pwd):/backup alpine tar xzf /backup/edusmart-backup.tar.gz -C /
```

## Optional: Reverse Proxy Setup

### Caddy Configuration
Uncomment the Caddy service in `docker-compose.yml` and create a `Caddyfile`:

```caddy
yourdomain.com {
    reverse_proxy web:3000
    reverse_proxy /api/* api:8000
}
```

This provides:
- Automatic HTTPS with Let's Encrypt
- Load balancing
- Request routing
- SSL termination

## Support

For issues:
1. Check this runbook first
2. Review service logs: `docker compose logs -f`
3. Verify environment configuration
4. Check Docker and Docker Compose versions
5. Ensure all required files exist

Contact: [support@edusmart.com](mailto:support@edusmart.com)
