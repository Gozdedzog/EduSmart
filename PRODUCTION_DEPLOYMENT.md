# 🚀 EduSmart Production Deployment Guide

Bu rehber, EduSmart projesini production ortamında domain ve sunucu ile canlıya almak için gerekli tüm adımları içerir.

## 🚨 Docker Hatası Çözümü

Gördüğünüz `no matching manifest for linux/amd64` hatası için yapılan değişiklikler:

### ✅ Yapılan Düzeltmeler:
1. **Multi-architecture Dockerfile'lar**: `--platform=$BUILDPLATFORM` eklendi
2. **Production Docker Compose**: Multi-arch support eklendi
3. **Build Script**: Multi-architecture build script oluşturuldu
4. **Deployment Script**: Otomatik deployment script hazırlandı

## 📋 Gereksinimler

### Sunucu Gereksinimleri:
- **RAM**: Minimum 2GB (4GB önerilen)
- **CPU**: 2 core (4 core önerilen)
- **Disk**: 20GB boş alan
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### Yazılım Gereksinimleri:
- Docker 20.10+
- Docker Compose 2.0+
- Git
- SSH erişimi

## 🔧 Sunucu Hazırlığı

### 1. Sunucuya Bağlanın
```bash
ssh root@your-server-ip
```

### 2. Sistem Güncellemesi
```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# CentOS/RHEL
yum update -y
```

### 3. Docker Kurulumu
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Docker Compose kurulumu
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 4. Firewall Ayarları
```bash
# UFW (Ubuntu)
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable

# iptables (CentOS)
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
```

## 🌐 Domain ve DNS Ayarları

### 1. Domain Satın Alın
- Namecheap, GoDaddy, Cloudflare gibi sağlayıcılardan domain satın alın

### 2. DNS Kayıtları
```
A Record:     @           -> your-server-ip
A Record:     www         -> your-server-ip
A Record:     api         -> your-server-ip
CNAME:        *.yourdomain.com -> yourdomain.com
```

### 3. DNS Propagation Kontrolü
```bash
# DNS propagation kontrolü
nslookup yourdomain.com
dig yourdomain.com
```

## 🔐 SSL Sertifikası

Caddy otomatik olarak Let's Encrypt SSL sertifikası alacak. Manuel kurulum için:

```bash
# Certbot kurulumu (alternatif)
apt install certbot python3-certbot-nginx -y

# SSL sertifikası alma
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

## 📦 Deployment Adımları

### 1. Proje Hazırlığı
```bash
# Local makinede
cd /Users/gozde/Desktop/edu_smart_2

# Environment dosyasını oluşturun
cp env.production.example .env.production

# .env.production dosyasını düzenleyin
nano .env.production
```

### 2. Environment Değişkenlerini Güncelleyin
```bash
# .env.production dosyasında şunları değiştirin:
SECRET_KEY=your-super-secure-secret-key-here
DOMAIN=yourdomain.com
API_DOMAIN=api.yourdomain.com
ALLOWED_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

### 3. Caddyfile'ı Güncelleyin
```bash
# Caddyfile'da domain'i değiştirin
sed -i 's/yourdomain.com/yourdomain.com/g' Caddyfile
```

### 4. Production Build
```bash
# Multi-architecture build
./build-production.sh
```

### 5. Deployment
```bash
# Otomatik deployment
./deploy.sh yourdomain.com root your-server-ip

# Manuel deployment
scp -r . root@your-server-ip:/opt/edusmart/
ssh root@your-server-ip "cd /opt/edusmart && docker-compose -f docker-compose.prod.yml up -d"
```

## 🔍 Deployment Sonrası Kontroller

### 1. Servis Durumu
```bash
ssh root@your-server-ip
cd /opt/edusmart
docker-compose -f docker-compose.prod.yml ps
```

### 2. Log Kontrolü
```bash
# Tüm servislerin logları
docker-compose -f docker-compose.prod.yml logs -f

# Sadece web servisi
docker-compose -f docker-compose.prod.yml logs -f web

# Sadece API servisi
docker-compose -f docker-compose.prod.yml logs -f api
```

### 3. Health Check
```bash
# Web uygulaması
curl https://yourdomain.com

# API health check
curl https://yourdomain.com/health

# ML API health check
curl https://yourdomain.com/api/v1/ml/health
```

## 🚨 Sorun Giderme

### Docker Hatası Çözümleri

#### 1. `no matching manifest for linux/amd64`
```bash
# Multi-architecture build
docker buildx build --platform linux/amd64,linux/arm64 -t your-image .

# Sadece amd64 için build
docker buildx build --platform linux/amd64 -t your-image .
```

#### 2. Port Çakışması
```bash
# Port kullanımını kontrol et
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Çakışan servisi durdur
systemctl stop nginx
systemctl stop apache2
```

#### 3. SSL Sertifika Sorunu
```bash
# Caddy loglarını kontrol et
docker-compose -f docker-compose.prod.yml logs caddy

# Manuel SSL kurulumu
certbot certonly --standalone -d yourdomain.com
```

### Performans Optimizasyonu

#### 1. Nginx Reverse Proxy (Alternatif)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 2. Monitoring ve Logging
```bash
# Log rotation
cat > /etc/logrotate.d/edusmart << EOF
/opt/edusmart/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

# System monitoring
apt install htop iotop nethogs -y
```

## 🔄 Güncelleme ve Bakım

### 1. Kod Güncellemesi
```bash
# Local'de
git pull origin main
./build-production.sh
./deploy.sh yourdomain.com root your-server-ip
```

### 2. Backup
```bash
# Veri backup'ı
tar -czf edusmart-backup-$(date +%Y%m%d).tar.gz /opt/edusmart/data/

# Database backup (eğer varsa)
docker-compose -f docker-compose.prod.yml exec db pg_dump -U user dbname > backup.sql
```

### 3. Güvenlik Güncellemeleri
```bash
# Sistem güncellemesi
apt update && apt upgrade -y

# Docker image güncellemesi
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring ve Alerting

### 1. Uptime Monitoring
- UptimeRobot
- Pingdom
- StatusCake

### 2. Application Monitoring
- Sentry (error tracking)
- New Relic (performance)
- Grafana + Prometheus

### 3. Log Monitoring
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Fluentd
- Papertrail

## 🆘 Acil Durum Planı

### 1. Rollback
```bash
# Önceki versiyona dön
docker-compose -f docker-compose.prod.yml down
git checkout previous-version
./deploy.sh yourdomain.com root your-server-ip
```

### 2. Disaster Recovery
```bash
# Backup'tan restore
tar -xzf edusmart-backup-YYYYMMDD.tar.gz -C /
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Destek

### Log Dosyaları
```bash
# Application logs
/opt/edusmart/logs/

# System logs
/var/log/syslog
/var/log/nginx/error.log
```

### Debug Komutları
```bash
# Container durumu
docker ps -a

# Resource kullanımı
docker stats

# Network durumu
docker network ls
docker network inspect edusmart-network
```

---

## 🎯 Hızlı Başlangıç Özeti

1. **Sunucu hazırla** (Docker, firewall)
2. **Domain satın al** ve DNS ayarla
3. **Environment dosyasını** güncelle
4. **Build ve deploy** et: `./deploy.sh yourdomain.com root your-server-ip`
5. **SSL sertifikası** otomatik alınacak
6. **Test et**: https://yourdomain.com

**Not**: Bu rehber production ortamı için hazırlanmıştır. Test ortamında önce deneyin!
