#!/bin/bash

# WhiteStartups - Shopping Online Platform
# Generic Startup Script for Linux and macOS
# Author: GitHub Copilot
# Date: July 2025

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="WhiteStartups Shopping Platform"
BACKEND_PORT=3000
FRONTEND_PORT=3001
NODE_MIN_VERSION="18.0.0"
NPM_MIN_VERSION="8.0.0"

# Helper functions
print_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                  WhiteStartups Shopping Platform            ║"
    echo "║                     Startup Script v1.0                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')] $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Version comparison function
version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Check system requirements
check_requirements() {
    print_step "Checking system requirements..."
    
    # Check OS
    case "$(uname -s)" in
        Darwin*)
            OS="macOS"
            print_success "Running on macOS"
            ;;
        Linux*)
            OS="Linux"
            print_success "Running on Linux"
            ;;
        *)
            print_error "Unsupported operating system: $(uname -s)"
            print_info "This script only supports Linux and macOS"
            exit 1
            ;;
    esac
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        if version_ge "$NODE_VERSION" "$NODE_MIN_VERSION"; then
            print_success "Node.js $NODE_VERSION (required: >=$NODE_MIN_VERSION)"
        else
            print_error "Node.js version $NODE_VERSION is too old (required: >=$NODE_MIN_VERSION)"
            print_info "Please update Node.js: https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Node.js is not installed"
        print_info "Install Node.js from: https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        if version_ge "$NPM_VERSION" "$NPM_MIN_VERSION"; then
            print_success "npm $NPM_VERSION (required: >=$NPM_MIN_VERSION)"
        else
            print_warning "npm version $NPM_VERSION is old (recommended: >=$NPM_MIN_VERSION)"
            print_info "Consider updating: npm install -g npm@latest"
        fi
    else
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version | awk '{print $3}')
        print_success "Git $GIT_VERSION"
    else
        print_warning "Git is not installed (optional but recommended)"
    fi
    
    # Check for optional tools
    if command_exists docker; then
        print_success "Docker is available"
    else
        print_info "Docker not found (optional - for containerized MongoDB/Redis)"
    fi
    
    if command_exists mongod || command_exists brew || command_exists apt-get; then
        print_success "Package manager available for MongoDB installation"
    else
        print_info "Consider installing MongoDB for local development"
    fi
}

# Kill existing processes on our ports
cleanup_ports() {
    print_step "Cleaning up existing processes..."
    
    # Kill processes on backend port
    if lsof -ti:$BACKEND_PORT >/dev/null 2>&1; then
        print_info "Killing process on port $BACKEND_PORT"
        kill -9 $(lsof -ti:$BACKEND_PORT) 2>/dev/null || true
    fi
    
    # Kill processes on frontend port
    if lsof -ti:$FRONTEND_PORT >/dev/null 2>&1; then
        print_info "Killing process on port $FRONTEND_PORT"
        kill -9 $(lsof -ti:$FRONTEND_PORT) 2>/dev/null || true
    fi
    
    # Kill any remaining server processes
    pkill -f "ts-node.*src/index.ts" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "node.*dist/index.js" 2>/dev/null || true
    
    sleep 2
    print_success "Ports cleaned up"
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    # Backend dependencies
    if [ -f "package.json" ]; then
        print_info "Installing backend dependencies..."
        npm install
        print_success "Backend dependencies installed"
    else
        print_error "Backend package.json not found"
        exit 1
    fi
    
    # Frontend dependencies
    if [ -f "frontend/package.json" ]; then
        print_info "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
        print_success "Frontend dependencies installed"
    else
        print_error "Frontend package.json not found"
        exit 1
    fi
}

# Setup environment files
setup_environment() {
    print_step "Setting up environment configuration..."
    
    # Backend .env
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
        else
            print_info "Creating default .env file..."
            cat > .env << EOF
# Environment
NODE_ENV=development

# Server
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database
MONGODB_URI=mongodb://localhost:27017/whitestartups-shopping

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Email (optional)
EMAIL_FROM=noreply@whitestartups.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3001

# Dropshipping (optional)
PRINTFUL_API_KEY=your-printful-api-key
SPOCKET_API_KEY=your-spocket-api-key
EOF
            print_success "Created default .env file"
        fi
        print_warning "Please review and update .env file with your actual configuration"
    else
        print_success ".env file already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        print_info "Creating frontend environment file..."
        cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=WhiteStartups Shopping Online
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
EOF
        print_success "Created frontend/.env.local"
    else
        print_success "Frontend .env.local already exists"
    fi
}

# Build the project
build_project() {
    print_step "Building the project..."
    
    # Build backend
    print_info "Building backend..."
    npm run build
    print_success "Backend built successfully"
    
    # Build frontend (optional, for production)
    if [ "$BUILD_FRONTEND" = "true" ]; then
        print_info "Building frontend..."
        cd frontend
        npm run build
        cd ..
        print_success "Frontend built successfully"
    fi
}

# Check database connectivity
check_database() {
    print_step "Checking database connectivity..."
    
    # Try to connect to MongoDB
    if command_exists mongosh; then
        if mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
            print_success "MongoDB is running and accessible"
        else
            print_warning "MongoDB is not running"
            print_info "Start MongoDB with: brew services start mongodb/brew/mongodb-community (macOS) or sudo systemctl start mongod (Linux)"
        fi
    elif command_exists mongo; then
        if mongo --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
            print_success "MongoDB is running and accessible"
        else
            print_warning "MongoDB is not running"
        fi
    else
        print_info "MongoDB client not found - install MongoDB for local development"
    fi
    
    # Try to connect to Redis (optional)
    if command_exists redis-cli; then
        if redis-cli ping >/dev/null 2>&1; then
            print_success "Redis is running and accessible"
        else
            print_info "Redis is not running (optional service)"
        fi
    else
        print_info "Redis client not found (optional service)"
    fi
}

# Start development servers
start_servers() {
    print_step "Starting development servers..."
    
    # Create logs directory
    mkdir -p logs
    
    case "$START_MODE" in
        "all")
            print_info "Starting both backend and frontend servers..."
            npm run dev:all
            ;;
        "backend")
            print_info "Starting backend server only..."
            npm run dev:server
            ;;
        "frontend")
            print_info "Starting frontend server only..."
            npm run dev:frontend
            ;;
        *)
            print_info "Starting both servers (default)..."
            npm run dev:all
            ;;
    esac
}

# Run tests
run_tests() {
    print_step "Running tests..."
    
    # API tests
    if [ -f "test-api.sh" ]; then
        print_info "Running API tests..."
        bash test-api.sh
    fi
    
    # Comprehensive tests
    if [ -f "comprehensive-test.sh" ]; then
        print_info "Running comprehensive tests..."
        bash comprehensive-test.sh
    fi
    
    print_success "Tests completed"
}

# Display usage information
show_usage() {
    echo -e "${CYAN}Usage: $0 [OPTIONS]${NC}"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -s, --setup         Run initial setup only (install deps, create env files)"
    echo "  -b, --build         Build the project"
    echo "  -t, --test          Run tests only"
    echo "  -c, --clean         Clean up ports and processes"
    echo "  --backend-only      Start backend server only"
    echo "  --frontend-only     Start frontend server only"
    echo "  --build-frontend    Also build frontend for production"
    echo "  --skip-deps         Skip dependency installation"
    echo "  --skip-env          Skip environment setup"
    echo "  --skip-build        Skip build step"
    echo "  --skip-db-check     Skip database connectivity check"
    echo ""
    echo "Examples:"
    echo "  $0                  # Full startup (setup + build + start all servers)"
    echo "  $0 --setup          # Setup only"
    echo "  $0 --backend-only   # Start backend only"
    echo "  $0 --test           # Run tests only"
    echo "  $0 --clean          # Clean up and exit"
    echo ""
}

# Display post-startup information
show_post_startup_info() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    🚀 STARTUP COMPLETE!                     ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📱 Application URLs:${NC}"
    echo -e "   Frontend:  ${YELLOW}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "   Backend:   ${YELLOW}http://localhost:$BACKEND_PORT${NC}"
    echo -e "   API Docs:  ${YELLOW}http://localhost:$BACKEND_PORT/api/status${NC}"
    echo -e "   Debug:     ${YELLOW}http://localhost:$FRONTEND_PORT/debug${NC}"
    echo ""
    echo -e "${CYAN}🔧 Development Commands:${NC}"
    echo -e "   Stop servers:        ${YELLOW}npm run stop${NC}"
    echo -e "   Kill all processes:  ${YELLOW}npm run kill${NC}"
    echo -e "   Run tests:           ${YELLOW}npm test${NC}"
    echo -e "   API tests:           ${YELLOW}./test-api.sh${NC}"
    echo ""
    echo -e "${CYAN}📚 API Endpoints:${NC}"
    echo -e "   Auth:        ${YELLOW}/api/auth${NC}"
    echo -e "   Products:    ${YELLOW}/api/products${NC}"
    echo -e "   Users:       ${YELLOW}/api/users${NC}"
    echo -e "   Networking:  ${YELLOW}/api/networking${NC}"
    echo -e "   Cart:        ${YELLOW}/api/cart${NC}"
    echo ""
    echo -e "${GREEN}Happy coding! 🎉${NC}"
    echo ""
}

# Main execution
main() {
    # Parse command line arguments
    SETUP_ONLY=false
    BUILD_ONLY=false
    TEST_ONLY=false
    CLEAN_ONLY=false
    START_MODE="all"
    BUILD_FRONTEND=false
    SKIP_DEPS=false
    SKIP_ENV=false
    SKIP_BUILD=false
    SKIP_DB_CHECK=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--setup)
                SETUP_ONLY=true
                shift
                ;;
            -b|--build)
                BUILD_ONLY=true
                shift
                ;;
            -t|--test)
                TEST_ONLY=true
                shift
                ;;
            -c|--clean)
                CLEAN_ONLY=true
                shift
                ;;
            --backend-only)
                START_MODE="backend"
                shift
                ;;
            --frontend-only)
                START_MODE="frontend"
                shift
                ;;
            --build-frontend)
                BUILD_FRONTEND=true
                shift
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --skip-env)
                SKIP_ENV=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-db-check)
                SKIP_DB_CHECK=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    print_banner
    
    # Clean only mode
    if [ "$CLEAN_ONLY" = true ]; then
        cleanup_ports
        print_success "Cleanup completed"
        exit 0
    fi
    
    # Test only mode
    if [ "$TEST_ONLY" = true ]; then
        check_requirements
        run_tests
        exit 0
    fi
    
    # Main startup sequence
    check_requirements
    cleanup_ports
    
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies
    fi
    
    if [ "$SKIP_ENV" = false ]; then
        setup_environment
    fi
    
    if [ "$SKIP_DB_CHECK" = false ]; then
        check_database
    fi
    
    # Setup only mode
    if [ "$SETUP_ONLY" = true ]; then
        print_success "Setup completed successfully"
        exit 0
    fi
    
    # Build only mode
    if [ "$BUILD_ONLY" = true ]; then
        build_project
        print_success "Build completed successfully"
        exit 0
    fi
    
    # Full startup
    if [ "$SKIP_BUILD" = false ]; then
        build_project
    fi
    
    show_post_startup_info
    
    # Start servers (this will block)
    start_servers
}

# Run main function with all arguments
main "$@"
