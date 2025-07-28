#!/bin/bash

# Project Reorganization Script
# This script implements the reorganization plan outlined in docs/project-reorganization.md

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Root directory
ROOT_DIR="$(pwd)"

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

# Create backup
create_backup() {
  log "Creating backup of current project..."
  BACKUP_DIR=".backups/reorganization-$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  
  # Copy important directories
  cp -r src "$BACKUP_DIR/"
  cp -r frontend "$BACKUP_DIR/"
  cp -r backend "$BACKUP_DIR/"
  cp package.json "$BACKUP_DIR/"
  
  log "Backup created at $BACKUP_DIR"
}

# Set up monorepo structure
setup_monorepo() {
  log "Setting up monorepo structure..."
  
  # Create packages directory
  mkdir -p packages/api/src
  mkdir -p packages/web/src
  mkdir -p packages/shared/src
  
  # Create package.json files
  cat > packages/api/package.json << EOF
{
  "name": "@shoppingcart/api",
  "version": "1.0.0",
  "description": "Shopping Cart API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "@shoppingcart/shared": "1.0.0",
    "express": "^4.19.2",
    "mongoose": "^8.5.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.1.4",
    "jest": "^30.0.0"
  }
}
EOF

  cat > packages/web/package.json << EOF
{
  "name": "@shoppingcart/web",
  "version": "1.0.0",
  "description": "Shopping Cart Web Frontend",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  },
  "dependencies": {
    "@shoppingcart/shared": "1.0.0",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "jest": "^30.0.0"
  }
}
EOF

  cat > packages/shared/package.json << EOF
{
  "name": "@shoppingcart/shared",
  "version": "1.0.0",
  "description": "Shared code for Shopping Cart",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "jest": "^30.0.0"
  }
}
EOF

  # Update root package.json
  jq '.workspaces = ["packages/*"]' package.json > package.json.tmp
  mv package.json.tmp package.json
  
  log "Monorepo structure created"
}

# Create shared types
create_shared_types() {
  log "Creating shared types..."
  
  mkdir -p packages/shared/src/types/models
  mkdir -p packages/shared/src/types/api
  
  # Create index.ts
  cat > packages/shared/src/types/index.ts << EOF
export * from './models';
export * from './api';
EOF

  # Create models index
  cat > packages/shared/src/types/models/index.ts << EOF
export * from './Product';
export * from './Category';
export * from './User';
export * from './Vendor';
export * from './Order';
export * from './Cart';
export * from './News';
EOF

  # Create API index
  cat > packages/shared/src/types/api/index.ts << EOF
export * from './requests';
export * from './responses';
EOF

  log "Shared types structure created"
}

# Migrate backend code
migrate_backend() {
  log "Migrating backend code..."
  
  # Create feature directories
  mkdir -p packages/api/src/features/auth/controllers
  mkdir -p packages/api/src/features/auth/models
  mkdir -p packages/api/src/features/auth/routes
  mkdir -p packages/api/src/features/auth/services
  
  mkdir -p packages/api/src/features/products/controllers
  mkdir -p packages/api/src/features/products/models
  mkdir -p packages/api/src/features/products/routes
  mkdir -p packages/api/src/features/products/services
  
  mkdir -p packages/api/src/features/categories/controllers
  mkdir -p packages/api/src/features/categories/models
  mkdir -p packages/api/src/features/categories/routes
  mkdir -p packages/api/src/features/categories/services
  
  mkdir -p packages/api/src/features/vendors/controllers
  mkdir -p packages/api/src/features/vendors/models
  mkdir -p packages/api/src/features/vendors/routes
  mkdir -p packages/api/src/features/vendors/services
  
  mkdir -p packages/api/src/features/news/controllers
  mkdir -p packages/api/src/features/news/models
  mkdir -p packages/api/src/features/news/routes
  mkdir -p packages/api/src/features/news/services
  
  mkdir -p packages/api/src/middleware
  mkdir -p packages/api/src/utils
  mkdir -p packages/api/src/config
  
  log "Backend directory structure created"
}

# Migrate frontend code
migrate_frontend() {
  log "Migrating frontend code..."
  
  # Create feature directories
  mkdir -p packages/web/src/components/ui
  mkdir -p packages/web/src/components/layout
  mkdir -p packages/web/src/components/features/auth
  mkdir -p packages/web/src/components/features/products
  mkdir -p packages/web/src/components/features/categories
  mkdir -p packages/web/src/components/features/vendors
  mkdir -p packages/web/src/components/features/news
  
  mkdir -p packages/web/src/hooks
  mkdir -p packages/web/src/lib
  mkdir -p packages/web/src/services
  mkdir -p packages/web/src/context
  
  log "Frontend directory structure created"
}

# Create slug consistency helpers
create_slug_helpers() {
  log "Creating slug consistency helpers..."
  
  # Create shared slug utility
  mkdir -p packages/shared/src/utils
  
  cat > packages/shared/src/utils/slugUtils.ts << EOF
/**
 * Utility functions for slug generation and validation
 */

/**
 * Generate a slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Validate if a string is a valid slug
 * @param slug The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Create a regex pattern to find similar slugs
 * @param baseSlug The base slug
 * @returns A RegExp that matches the slug with optional numeric suffix
 */
export function createSlugRegex(baseSlug: string): RegExp {
  return new RegExp(\`^\${baseSlug}(-[0-9]*)?$\`, 'i');
}
EOF

  log "Slug helpers created"
}

# Main execution
main() {
  log "Starting project reorganization..."
  
  # Create backup first
  create_backup
  
  # Set up monorepo structure
  setup_monorepo
  
  # Create shared types
  create_shared_types
  
  # Migrate backend code
  migrate_backend
  
  # Migrate frontend code
  migrate_frontend
  
  # Create slug consistency helpers
  create_slug_helpers
  
  log "Project reorganization structure created. Please follow the migration guide to move existing code."
  log "See docs/project-reorganization.md for detailed instructions."
}

# Run the script
main