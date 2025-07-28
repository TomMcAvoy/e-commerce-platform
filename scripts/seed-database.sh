#!/bin/bash

# Script to seed the database with comprehensive test data

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Log function
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

# Warning function
warn() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Error function
error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
  error "Please run this script from the project root directory"
fi

# Create necessary directories
mkdir -p packages/api/src/seeders/data

# Skip MongoDB check due to VS Code terminal issues
log "Skipping MongoDB check due to VS Code terminal issues."
warn "Please ensure MongoDB is running before continuing."
warn "If the seeder fails, you may need to start MongoDB manually."

# Run the seeder
log "Running database seeder..."
cd packages/api
npx ts-node src/seeders/ComprehensiveSeeder.ts

# Check if seeding was successful
if [ $? -eq 0 ]; then
  log "Database seeded successfully!"
  log "You can now start the application and explore the data."
else
  error "Failed to seed the database. Check the error messages above."
fi