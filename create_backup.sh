#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/create-backup.sh

echo "📦 Creating comprehensive backup following Critical Development Workflows..."
echo "📁 Working directory: $(pwd)"

# Colors for output following Project-Specific Conventions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Create timestamp for backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="shoppingcart_backup_${TIMESTAMP}"
BACKUP_DIR="../${BACKUP_NAME}"

echo -e "${BLUE}📦 Backup Details:${NC}"
echo "  Source: $(pwd)"
echo "  Destination: ${BACKUP_DIR}"
echo "  Timestamp: ${TIMESTAMP}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in project root directory${NC}"
    echo "Please navigate to /Users/thomasmcavoy/GitHub/shoppingcart first"
    exit 1
fi

echo -e "${YELLOW}🔍 Pre-backup analysis...${NC}"

# Get project info
PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
PROJECT_SIZE=$(du -sh . 2>/dev/null | cut -f1)
FILE_COUNT=$(find . -type f -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | wc -l)

echo "  Project: ${PROJECT_NAME}"
echo "  Size: ${PROJECT_SIZE}"
echo "  Files: ${FILE_COUNT} (excluding node_modules)"
echo ""

# Create backup directory
echo -e "${BLUE}📁 Creating backup directory...${NC}"
mkdir -p "${BACKUP_DIR}"

# Backup core project files following Architecture Patterns
echo -e "${YELLOW}📋 Backing up Backend Structure (src/)...${NC}"
if [ -d "src" ]; then
    cp -r src "${BACKUP_DIR}/"
    echo "  ✅ Backend source code"
else
    echo "  ⚠️  No src/ directory found"
fi

echo -e "${YELLOW}📋 Backing up Frontend Structure (frontend/)...${NC}"
if [ -d "frontend" ]; then
    # Copy frontend excluding node_modules
    rsync -av --exclude='node_modules' --exclude='.next' frontend/ "${BACKUP_DIR}/frontend/"
    echo "  ✅ Frontend application"
else
    echo "  ⚠️  No frontend/ directory found"
fi

echo -e "${YELLOW}📋 Backing up Configuration Files...${NC}"
# Core config files
for file in package.json package-lock.json .env .env.example .gitignore README.md; do
    if [ -f "$file" ]; then
        cp "$file" "${BACKUP_DIR}/"
        echo "  ✅ $file"
    fi
done

# TypeScript and build configs
for file in tsconfig.json jest.config.ts jest.config.js; do
    if [ -f "$file" ]; then
        cp "$file" "${BACKUP_DIR}/"
        echo "  ✅ $file"
    fi
done

echo -e "${YELLOW}📋 Backing up Testing Infrastructure...${NC}"
if [ -d "tests" ]; then
    cp -r tests "${BACKUP_DIR}/"
    echo "  ✅ Test suite"
fi

# Test scripts and shell files
find . -maxdepth 1 -name "*.sh" -type f | while read script; do
    cp "$script" "${BACKUP_DIR}/"
    echo "  ✅ $script"
done

echo -e "${YELLOW}📋 Backing up Environment & Configuration...${NC}"
if [ -d ".github" ]; then
    cp -r .github "${BACKUP_DIR}/"
    echo "  ✅ GitHub configuration (including copilot-instructions.md)"
fi

# Documentation
for file in COPILOT_INSTRUCTIONS.md API_DOCS.md DEPLOYMENT.md; do
    if [ -f "$file" ]; then
        cp "$file" "${BACKUP_DIR}/"
        echo "  ✅ $file"
    fi
done

echo -e "${YELLOW}📋 Backing up Upload Directory...${NC}"
if [ -d "uploads" ]; then
    cp -r uploads "${BACKUP_DIR}/"
    echo "  ✅ File uploads"
fi

echo -e "${YELLOW}📋 Backing up Database Scripts...${NC}"
if [ -d "scripts" ]; then
    cp -r scripts "${BACKUP_DIR}/"
    echo "  ✅ Database scripts"
fi

# Create backup manifest following Debugging & Testing Ecosystem
echo -e "${BLUE}📝 Creating backup manifest...${NC}"
cat > "${BACKUP_DIR}/BACKUP_MANIFEST.md" << EOF
# Backup Manifest - Whitestart System Security
**Created**: $(date)
**Source**: $(pwd)
**Backup**: ${BACKUP_NAME}

## Project Information
- **Name**: ${PROJECT_NAME}
- **Size**: ${PROJECT_SIZE}
- **Files**: ${FILE_COUNT} (excluding node_modules)

## Backup Contents Following Architecture Patterns

### Backend Structure (src/)
$(if [ -d "src" ]; then echo "✅ Complete backend source code"; else echo "❌ No backend found"; fi)
- Controllers (HTTP request handlers)
- Services (Business logic, DropshippingService pattern)
- Middleware (Custom AppError class)
- Models (Mongoose schemas)
- Routes (Express routers)

### Frontend Structure (frontend/)
$(if [ -d "frontend" ]; then echo "✅ Complete frontend application"; else echo "❌ No frontend found"; fi)
- App Router (Next.js 15 app directory)
- Context Providers (CartProvider pattern)
- Components (UI organization)
- API Integration (lib/api.ts)

### Configuration Files
$(ls -1 ${BACKUP_DIR}/*.json ${BACKUP_DIR}/.env* ${BACKUP_DIR}/.git* 2>/dev/null | sed 's|.*\/||' | sed 's/^/- /')

### Testing Infrastructure
$(if [ -d "tests" ]; then echo "✅ Complete test suite"; else echo "❌ No tests found"; fi)
$(find ${BACKUP_DIR} -name "*.sh" -type f | sed 's|.*\/||' | sed 's/^/- /')

## Critical Development Workflows Preserved
- Server Management scripts
- Database seeding capabilities
- Testing ecosystem
- Debug dashboard configuration

## Restoration Instructions
1. Extract to new location
2. Run: npm install
3. Copy .env.example to .env and configure
4. Run: npm run setup
5. Test: npm run dev:all

## Security Considerations Maintained
- JWT authentication patterns
- CORS configuration
- Rate limiting setup
- Input sanitization
- Password hashing (bcryptjs)

---
**Backup created following Project-Specific Conventions**
EOF

# Create git info if available
if [ -d ".git" ]; then
    echo -e "${BLUE}📝 Capturing git information...${NC}"
    cat > "${BACKUP_DIR}/GIT_INFO.txt" << EOF
Git Repository Information
=========================
Branch: $(git branch --show-current 2>/dev/null || echo "Unknown")
Commit: $(git rev-parse HEAD 2>/dev/null || echo "Unknown")
Status: 
$(git status --porcelain 2>/dev/null || echo "Not available")

Recent commits:
$(git log --oneline -5 2>/dev/null || echo "Not available")
EOF
    echo "  ✅ Git repository information"
fi

# Calculate backup size
BACKUP_SIZE=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)

echo ""
echo -e "${GREEN}✅ BACKUP COMPLETED SUCCESSFULLY!${NC}"
echo ""
echo -e "${PURPLE}📊 BACKUP SUMMARY:${NC}"
echo "  📦 Name: ${BACKUP_NAME}"
echo "  📁 Location: ${BACKUP_DIR}"
echo "  📏 Size: ${BACKUP_SIZE}"
echo "  📄 Manifest: ${BACKUP_DIR}/BACKUP_MANIFEST.md"
echo ""

echo -e "${BLUE}🚀 QUICK ACTIONS:${NC}"
echo ""
echo -e "${YELLOW}View backup:${NC}"
echo "  ls -la ${BACKUP_DIR}"
echo ""
echo -e "${YELLOW}Create archive:${NC}"
echo "  tar -czf ${BACKUP_NAME}.tar.gz -C .. ${BACKUP_NAME}"
echo ""
echo -e "${YELLOW}Restore backup:${NC}"
echo "  cp -r ${BACKUP_DIR} /path/to/new/location"
echo "  cd /path/to/new/location"
echo "  npm run setup"
echo ""

echo -e "${GREEN}💡 Backup stored safely following Environment & Configuration patterns${NC}"
echo -e "${BLUE}📝 Review BACKUP_MANIFEST.md for complete restoration instructions${NC}"

# Optional: Create compressed archive
read -p "Create compressed archive? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📦 Creating compressed archive...${NC}"
    cd ..
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
    ARCHIVE_SIZE=$(du -sh "${BACKUP_NAME}.tar.gz" 2>/dev/null | cut -f1)
    echo -e "${GREEN}✅ Archive created: ${BACKUP_NAME}.tar.gz (${ARCHIVE_SIZE})${NC}"
    cd - > /dev/null
fi

echo ""
echo -e "${PURPLE}🛡️  Backup complete following Critical Development Workflows!${NC}"
