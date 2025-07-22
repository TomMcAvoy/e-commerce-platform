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
BACKEND_PORT=3010
FRONTEND_PORT=3011
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

print_error() {
    print_color $RED "❌ $1"
}

print_info() {
    print_color $PURPLE "ℹ️  $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare version numbers
version_compare() {
    local version1=$1
    local version2=$2
    
    if [[ "$(printf '%s\n' "$version1" "$version2" | sort -V | head -n1)" == "$version1" ]]; then
        return 0  # version1 <= version2
    else
        return 1  # version1 > version2
    fi
}

# Function to check Node.js version
check_node_version() {
    if ! command_exists node; then
        print_error "Node.js is not installed"
        print_info "Please install Node.js version $REQUIRED_NODE_VERSION or higher"
        print_info "Visit: https://nodejs.org/"
        exit 1
    fi
    
    local current_version=$(node -v | sed 's/v//')
    if version_compare "$current_version" "$REQUIRED_NODE_VERSION"; then
        print_success "Node.js version $current_version is compatible"
    else
        print_error "Node.js version $current_version is too old"
        print_info "Required version: $REQUIRED_NODE_VERSION or higher"
        exit 1
    fi
}

# Function to check npm
check_npm() {
    if ! command_exists npm; then
        print_error "npm is not installed"
        print_info "npm should come with Node.js installation"
        exit 1
    fi
    
    local npm_version=$(npm -v)
    print_success "npm version $npm_version found"
}

# Function to check MongoDB
check_mongodb() {
    if command_exists mongod; then
        print_success "MongoDB is installed"
        
        # Try to connect to MongoDB
        if mongo --eval "db.runCommand('ping').ok" localhost/test --quiet >/dev/null 2>&1; then
            print_success "MongoDB is running"
        else
            print_warning "MongoDB is installed but not running"
            print_info "Starting MongoDB..."
            
            # Try different methods to start MongoDB
            if command_exists brew; then
                brew services start mongodb/brew/mongodb-community >/dev/null 2>&1 || true
            elif command_exists systemctl; then
                sudo systemctl start mongod >/dev/null 2>&1 || true
            fi
            
            sleep 3
            
            if mongo --eval "db.runCommand('ping').ok" localhost/test --quiet >/dev/null 2>&1; then
                print_success "MongoDB started successfully"
            else
                print_warning "Could not start MongoDB automatically"
                print_info "Please start MongoDB manually"
            fi
        fi
    else
        print_warning "MongoDB is not installed"
        print_info "The application will work without MongoDB, but database features will be limited"
        print_info "To install MongoDB, visit: https://docs.mongodb.com/manual/installation/"
    fi
}

# Function to check Redis
check_redis() {
    if command_exists redis-server; then
        print_success "Redis is installed"
        
        # Try to connect to Redis
        if redis-cli ping >/dev/null 2>&1; then
            print_success "Redis is running"
        else
            print_warning "Redis is installed but not running"
            print_info "Starting Redis..."
            
            # Try different methods to start Redis
            if command_exists brew; then
                brew services start redis >/dev/null 2>&1 || true
            elif command_exists systemctl; then
                sudo systemctl start redis >/dev/null 2>&1 || true
            else
                redis-server --daemonize yes >/dev/null 2>&1 || true
            fi
            
            sleep 2
            
            if redis-cli ping >/dev/null 2>&1; then
                print_success "Redis started successfully"
            else
                print_warning "Could not start Redis automatically"
                print_info "Please start Redis manually with: redis-server"
            fi
        fi
    else
        print_warning "Redis is not installed"
        print_info "The application will work without Redis, but caching will be disabled"
        print_info "To install Redis, visit: https://redis.io/download"
    fi
}

# Function to setup environment file
setup_environment() {
    print_step "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        print_info "Creating .env file from template..."
        
        cat > .env << EOF
# Environment Configuration
NODE_ENV=development
PORT=$BACKEND_PORT
FRONTEND_URL=http://localhost:$FRONTEND_PORT

# Database Configuration
MONGODB_URI=$MONGODB_DEFAULT_URI
REDIS_URL=$REDIS_DEFAULT_URL

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_EXPIRE=7d

# Email Configuration (Optional - for production)
EMAIL_SERVICE=gmail
EMAIL_FROM=noreply@whitestartups.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Dropshipping API Keys (Optional)
PRINTFUL_API_KEY=your-printful-api-key
SPOCKET_API_KEY=your-spocket-api-key

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:$FRONTEND_PORT

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Session Configuration
SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')

# Social Media API Keys (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
EOF
        
        print_success "Environment file created"
        print_info "Please update the API keys and email configuration in .env file"
    else
        print_success "Environment file already exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_step "Installing backend dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Backend dependencies installed"
    else
        print_error "package.json not found in root directory"
        exit 1
    fi
    
    print_step "Installing frontend dependencies..."
    
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        cd frontend
        npm install
        cd ..
        print_success "Frontend dependencies installed"
    else
        print_warning "Frontend directory or package.json not found"
        print_info "Skipping frontend dependency installation"
    fi
}

# Function to build the project
build_project() {
    print_step "Building the project..."
    
    # Build backend
    if npm run build >/dev/null 2>&1; then
        print_success "Backend built successfully"
    else
        print_error "Backend build failed"
        print_info "Running build with verbose output..."
        npm run build
        exit 1
    fi
    
    # Build frontend if it exists
    if [ -d "frontend" ]; then
        print_step "Building frontend..."
        cd frontend
        if npm run build >/dev/null 2>&1; then
            print_success "Frontend built successfully"
        else
            print_warning "Frontend build failed (this might be expected in development)"
        fi
        cd ..
    fi
}

# Function to setup database
setup_database() {
    print_step "Setting up database..."
    
    # Check if MongoDB is available
    if mongo --eval "db.runCommand('ping').ok" localhost/test --quiet >/dev/null 2>&1; then
        print_info "Seeding database with initial data..."
        
        if npm run seed >/dev/null 2>&1; then
            print_success "Database seeded successfully"
        else
            print_warning "Database seeding failed or no seed script available"
        fi
    else
        print_warning "MongoDB not available, skipping database setup"
    fi
}

# Function to run tests
run_tests() {
    print_step "Running tests..."
    
    if npm test >/dev/null 2>&1; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed or no tests available"
        print_info "You can run 'npm test' manually to see detailed results"
    fi
}

# Function to start the application
start_application() {
    print_step "Starting the application..."
    
    # Check if ports are available
    if lsof -i :$BACKEND_PORT >/dev/null 2>&1; then
        print_warning "Port $BACKEND_PORT is already in use"
        print_info "Attempting to stop existing processes..."
        pkill -f "node.*dist/index.js" >/dev/null 2>&1 || true
        pkill -f "ts-node.*src/index.ts" >/dev/null 2>&1 || true
        sleep 2
    fi
    
    if lsof -i :$FRONTEND_PORT >/dev/null 2>&1; then
        print_warning "Port $FRONTEND_PORT is already in use"
        print_info "Attempting to stop existing processes..."
        pkill -f "next.*dev" >/dev/null 2>&1 || true
        sleep 2
    fi
    
    print_success "Starting servers..."
    print_info "Backend will be available at: http://localhost:$BACKEND_PORT"
    print_info "Frontend will be available at: http://localhost:$FRONTEND_PORT"
    print_info "API Documentation: http://localhost:$BACKEND_PORT/api/status"
    print_info "Debug Dashboard: http://localhost:$FRONTEND_PORT/debug"
    echo ""
    print_color $YELLOW "Press Ctrl+C to stop all servers"
    echo ""
    
    # Start the application using the development script
    if command_exists npm && [ -f "package.json" ]; then
        if npm run dev:all >/dev/null 2>&1; then
            print_success "Application started successfully"
        else
            print_info "Trying alternative startup method..."
            npm run dev:server &
            BACKEND_PID=$!
            
            if [ -d "frontend" ]; then
                cd frontend
                npm run dev &
                FRONTEND_PID=$!
                cd ..
            fi
            
            # Wait for user interrupt
            trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
            wait
        fi
    else
        print_error "Cannot start application - npm or package.json not found"
        exit 1
    fi
}

# Function to show help
show_help() {
    print_header
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  -h, --help        Show this help message"
    echo "  -q, --quick       Quick start (skip tests and some checks)"
    echo "  -c, --check       Only run system checks"
    echo "  -s, --setup       Only run setup (no start)"
    echo "  -t, --test        Only run tests"
    echo "  --no-build        Skip build step"
    echo "  --no-seed         Skip database seeding"
    echo "  --backend-only    Start only backend server"
    echo "  --frontend-only   Start only frontend server"
    echo ""
    echo "Examples:"
    echo "  $0                 # Full startup with all checks"
    echo "  $0 -q              # Quick startup"
    echo "  $0 -c              # Check system requirements only"
    echo "  $0 --backend-only  # Start backend server only"
    echo ""
}

# Function to run system checks
run_checks() {
    print_header
    print_step "Running system checks..."
    echo ""
    
    check_node_version
    check_npm
    check_mongodb
    check_redis
    
    echo ""
    print_success "System checks completed"
}

# Function to run setup only
run_setup() {
    print_header
    print_step "Running project setup..."
    echo ""
    
    setup_environment
    install_dependencies
    
    if [ "$SKIP_BUILD" != "true" ]; then
        build_project
    fi
    
    if [ "$SKIP_SEED" != "true" ]; then
        setup_database
    fi
    
    echo ""
    print_success "Project setup completed"
    print_info "Run '$0' without arguments to start the application"
}

# Main function
main() {
    # Parse command line arguments
    QUICK_MODE=false
    CHECK_ONLY=false
    SETUP_ONLY=false
    TEST_ONLY=false
    SKIP_BUILD=false
    SKIP_SEED=false
    BACKEND_ONLY=false
    FRONTEND_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -q|--quick)
                QUICK_MODE=true
                shift
                ;;
            -c|--check)
                CHECK_ONLY=true
                shift
                ;;
            -s|--setup)
                SETUP_ONLY=true
                shift
                ;;
            -t|--test)
                TEST_ONLY=true
                shift
                ;;
            --no-build)
                SKIP_BUILD=true
                shift
                ;;
            --no-seed)
                SKIP_SEED=true
                shift
                ;;
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --frontend-only)
                FRONTEND_ONLY=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Run based on mode
    if [ "$CHECK_ONLY" = true ]; then
        run_checks
        exit 0
    elif [ "$SETUP_ONLY" = true ]; then
        run_checks
        run_setup
        exit 0
    elif [ "$TEST_ONLY" = true ]; then
        run_tests
        exit 0
    fi
    
    # Full startup process
    print_header
    
    # System checks
    if [ "$QUICK_MODE" != true ]; then
        run_checks
        echo ""
    fi
    
    # Project setup
    run_setup
    
    # Run tests
    if [ "$QUICK_MODE" != true ]; then
        echo ""
        run_tests
    fi
    
    # Start application
    echo ""
    start_application
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
