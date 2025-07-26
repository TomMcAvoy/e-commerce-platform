#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/diagnose-workspace.sh

echo "�� Diagnosing workspace structure following Critical Development Workflows..."
echo "📁 Working directory: $(pwd)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}📋 CURRENT DIRECTORY CONTENTS:${NC}"
ls -la

echo -e "\n${BLUE}📋 LOOKING FOR NESTED DIRECTORIES:${NC}"
find . -maxdepth 2 -name "shoppingcart" -type d 2>/dev/null | head -10

echo -e "\n${BLUE}📋 PACKAGE.JSON LOCATIONS:${NC}"
find . -name "package.json" -type f 2>/dev/null | head -10

echo -e "\n${BLUE}📋 SOURCE DIRECTORIES:${NC}"
find . -name "src" -type d 2>/dev/null | head -10

echo -e "\n${BLUE}📋 FRONTEND DIRECTORIES:${NC}"
find . -name "frontend" -type d 2>/dev/null | head -10

echo -e "\n${BLUE}📋 NODE_MODULES LOCATIONS:${NC}"
find . -name "node_modules" -type d 2>/dev/null | head -10

echo -e "\n${PURPLE}📊 STRUCTURE ANALYSIS:${NC}"

# Check if we're in the right directory
if [ -f "package.json" ] && [ -d "src" ] && [ -d "frontend" ]; then
    echo -e "✅ ${GREEN}ROOT LEVEL STRUCTURE LOOKS CORRECT${NC}"
    
    # Check for nested duplicate
    if [ -d "./shoppingcart" ]; then
        echo -e "⚠️  ${YELLOW}NESTED 'shoppingcart' DIRECTORY FOUND${NC}"
        echo -e "📁 Contents of nested directory:"
        ls -la ./shoppingcart/ 2>/dev/null | head -10
        
        echo -e "\n🔍 Comparing root vs nested package.json:"
        echo -e "${BLUE}ROOT package.json:${NC}"
        grep '"name"' package.json 2>/dev/null || echo "No package.json at root"
        
        echo -e "${BLUE}NESTED package.json:${NC}"
        grep '"name"' ./shoppingcart/package.json 2>/dev/null || echo "No package.json in nested dir"
        
        echo -e "\n${YELLOW}🚨 RECOMMENDED ACTION:${NC}"
        echo "You have a nested 'shoppingcart' directory that should be removed or consolidated."
        echo ""
        echo -e "${BLUE}Option 1 - Remove nested directory (if it's duplicate):${NC}"
        echo "rm -rf ./shoppingcart"
        echo ""
        echo -e "${BLUE}Option 2 - Move nested contents up (if nested has newer files):${NC}"
        echo "rsync -av ./shoppingcart/ ./ --exclude=node_modules"
        echo "rm -rf ./shoppingcart"
        echo ""
        echo -e "${BLUE}Option 3 - Backup and clean:${NC}"
        echo "mv ./shoppingcart ./shoppingcart.backup.$(date +%s)"
        
    else
        echo -e "✅ ${GREEN}NO NESTED DIRECTORIES FOUND${NC}"
    fi
    
else
    echo -e "❌ ${RED}STRUCTURE ISSUES DETECTED${NC}"
    echo "Current directory may not be the project root."
    echo ""
    echo "Expected structure:"
    echo "  ├── package.json"
    echo "  ├── src/"
    echo "  ├── frontend/"
    echo "  └── ..."
fi

echo -e "\n${BLUE}📋 GIT STATUS:${NC}"
if [ -d ".git" ]; then
    git status --porcelain | head -10
    echo ""
    echo "Git root: $(git rev-parse --show-toplevel 2>/dev/null)"
else
    echo "Not a git repository"
fi

echo -e "\n${BLUE}📋 ENVIRONMENT CHECK:${NC}"
echo "Current working directory: $(pwd)"
echo "Directory size: $(du -sh . 2>/dev/null | cut -f1)"
echo "File count: $(find . -type f 2>/dev/null | wc -l)"

echo -e "\n${PURPLE}💡 WORKSPACE RECOMMENDATIONS:${NC}"
echo ""
echo "1. Ensure you're in: /Users/thomasmcavoy/GitHub/shoppingcart"
echo "2. Root should contain: package.json, src/, frontend/, .env"
echo "3. Remove any nested 'shoppingcart' directories"
echo "4. Run: npm run setup (after cleaning structure)"
echo "5. Test: npm run dev:all"
