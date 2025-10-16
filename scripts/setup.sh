#!/bin/bash

# EduSmart Platform Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up EduSmart Platform..."

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
    fi
    
    print_status "All requirements satisfied!"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created .env file from .env.example"
        print_warning "Please update .env file with your configuration"
    else
        print_status ".env file already exists"
    fi
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd apps/web
    pnpm install
    cd ../..
    
    print_status "Frontend setup complete!"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    cd apps/api
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    cd ../..
    
    print_status "Backend setup complete!"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p data
    mkdir -p nginx
    
    print_status "Directories created!"
}

# Main setup function
main() {
    print_status "Starting EduSmart Platform setup..."
    
    check_requirements
    setup_env
    create_directories
    setup_frontend
    setup_backend
    
    print_status "🎉 Setup complete!"
    print_status ""
    print_status "To start the development environment:"
    print_status "  Frontend: cd apps/web && pnpm dev"
    print_status "  Backend:  cd apps/api && source venv/bin/activate && uvicorn src.main:app --reload"
    print_status ""
    print_status "Or use Docker Compose:"
    print_status "  docker-compose -f docker-compose.dev.yml up"
    print_status ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@"
