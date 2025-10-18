#!/bin/bash

# EduSmart Production Deployment Script
# This script deploys the application to production server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Configuration
DOMAIN=${1:-"yourdomain.com"}
SERVER_USER=${2:-"root"}
SERVER_HOST=${3:-"your-server-ip"}

print_header "🚀 Starting EduSmart Production Deployment"
print_status "Domain: $DOMAIN"
print_status "Server: $SERVER_USER@$SERVER_HOST"

# Check if required files exist
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found!"
    print_warning "Please copy env.production.example to .env.production and update the values"
    exit 1
fi

if [ ! -f "Caddyfile" ]; then
    print_error "Caddyfile not found!"
    exit 1
fi

# Update Caddyfile with actual domain
print_status "Updating Caddyfile with domain: $DOMAIN"
sed -i.bak "s/yourdomain.com/$DOMAIN/g" Caddyfile

# Build production images
print_status "Building production images..."
./build-production.sh

# Create deployment package
print_status "Creating deployment package..."
tar -czf edusmart-deployment.tar.gz \
    docker-compose.prod.yml \
    Caddyfile \
    .env.production \
    data/ \
    --exclude='*.log' \
    --exclude='node_modules' \
    --exclude='.git'

# Deploy to server
print_status "Deploying to server..."
scp edusmart-deployment.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Run deployment commands on server
print_status "Running deployment on server..."
ssh $SERVER_USER@$SERVER_HOST << EOF
    set -e
    
    # Create application directory
    mkdir -p /opt/edusmart
    cd /opt/edusmart
    
    # Extract deployment package
    tar -xzf /tmp/edusmart-deployment.tar.gz
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down || true
    
    # Pull latest images (if using registry)
    # docker-compose -f docker-compose.prod.yml pull
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be healthy
    echo "Waiting for services to start..."
    sleep 30
    
    # Check service health
    docker-compose -f docker-compose.prod.yml ps
    
    # Clean up
    rm /tmp/edusmart-deployment.tar.gz
    
    echo "✅ Deployment completed successfully!"
EOF

# Restore original Caddyfile
print_status "Restoring original Caddyfile..."
mv Caddyfile.bak Caddyfile

# Clean up local files
rm edusmart-deployment.tar.gz

print_status "🎉 Deployment completed successfully!"
print_status "Your application should be available at: https://$DOMAIN"
print_warning "Don't forget to:"
print_warning "1. Configure your DNS to point to the server"
print_warning "2. Set up SSL certificates (Caddy will handle this automatically)"
print_warning "3. Monitor the application logs: ssh $SERVER_USER@$SERVER_HOST 'cd /opt/edusmart && docker-compose -f docker-compose.prod.yml logs -f'"
