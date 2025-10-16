# 🚀 EduSmart Deployment Guide

This guide covers deploying the EduSmart platform in various environments.

## 📋 Prerequisites

- Docker and Docker Compose
- Domain name (for production)
- SSL certificates (for production)
- Server with minimum 2GB RAM, 2 CPU cores

## 🐳 Docker Deployment

### Development Environment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Run in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Environment

```bash
# Start production environment
docker-compose up -d

# Scale services
docker-compose up -d --scale web=3

# View logs
docker-compose logs -f
```

## 🌐 Manual Deployment

### Frontend (Next.js)

1. **Build the application**
   ```bash
   cd apps/web
   pnpm install
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

3. **Configure reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Backend (FastAPI)

1. **Set up Python environment**
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run with Gunicorn**
   ```bash
   gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
   ```

3. **Configure reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Frontend
NODE_ENV=production
NEXT_PUBLIC_ML_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Backend
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secure-secret-key
ALLOWED_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
LOG_LEVEL=WARNING
```

## 🔒 SSL Configuration

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    location / {
        proxy_pass http://localhost:3000;
        # ... proxy settings
    }
}
```

## 📊 Monitoring and Logging

### Application Logs

```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web
docker-compose logs -f api
```

### System Monitoring

```bash
# Monitor resource usage
docker stats

# Check container health
docker-compose ps
```

### Log Rotation

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/edusmart

# Add:
/var/log/edusmart/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /path/to/edusmart
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   sudo lsof -i :3000
   sudo lsof -i :8000
   
   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Docker build fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **ML model not found**
   ```bash
   # Check if model file exists
   ls -la data/best_learning_model_optimized.joblib
   
   # Ensure proper permissions
   chmod 644 data/best_learning_model_optimized.joblib
   ```

### Health Checks

```bash
# Check frontend health
curl http://localhost:3000

# Check backend health
curl http://localhost:8000/health

# Check ML service health
curl http://localhost:8000/api/v1/ml/health
```

## 📈 Performance Optimization

### Frontend Optimization

- Enable Next.js production optimizations
- Use CDN for static assets
- Implement caching strategies
- Optimize images and fonts

### Backend Optimization

- Use multiple Gunicorn workers
- Implement Redis caching
- Optimize database queries
- Use connection pooling

### Docker Optimization

- Use multi-stage builds
- Optimize layer caching
- Use .dockerignore files
- Implement health checks

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Configure firewall rules
- [ ] Enable SSL/TLS
- [ ] Set up security headers
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Backup strategy
- [ ] Disaster recovery plan

## 📞 Support

For deployment issues:
- Check the logs: `docker-compose logs -f`
- Verify environment variables
- Check network connectivity
- Review security configurations

Contact: [support@edusmart.com](mailto:support@edusmart.com)

## 🐍 Runtime

- **Python 3.11.9** (exported from venv)
- Local venv removed; Docker will install from requirements.txt
