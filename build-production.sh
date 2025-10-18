#!/bin/bash

# EduSmart Production Build Script
# This script builds multi-architecture Docker images for production deployment

set -e

echo "🚀 Building EduSmart for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    print_error "Docker Buildx is not available. Please update Docker or install buildx plugin."
    exit 1
fi

# Create buildx builder if it doesn't exist
print_status "Setting up multi-architecture builder..."
docker buildx create --name edusmart-builder --use 2>/dev/null || docker buildx use edusmart-builder

# Build multi-architecture images
print_status "Building multi-architecture images..."

# Build web image
print_status "Building web image (linux/amd64, linux/arm64)..."
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag edusmart-web:latest \
    --tag edusmart-web:$(date +%Y%m%d-%H%M%S) \
    --file apps/web/Dockerfile \
    apps/web/ \
    --push=false \
    --load

# Build API image
print_status "Building API image (linux/amd64, linux/arm64)..."
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag edusmart-api:latest \
    --tag edusmart-api:$(date +%Y%m%d-%H%M%S) \
    --file apps/api/Dockerfile \
    apps/api/ \
    --push=false \
    --load

print_status "✅ Build completed successfully!"

# Show built images
print_status "Built images:"
docker images | grep edusmart

print_status "🎉 Production build ready!"
print_warning "Don't forget to:"
print_warning "1. Update .env.production with your actual values"
print_warning "2. Update Caddyfile with your domain"
print_warning "3. Test the build locally before deploying"
