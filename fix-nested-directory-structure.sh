#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-nested-directory-structure.sh

echo "🔍 Analyzing nested directory structure following Critical Development Workflows..."
echo "📁 Working directory: $(pwd)"

# Colors for output following Project-Specific Conventions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Safety check
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in project root directory${NC}"
    echo "Please navigate to /Users/thomasmcavoy/GitHub/shoppingcart first"
    exit 1
fi

echo -e "${BLUE}📋 CURRENT WORKSPACE STRUCTURE ANALYSIS${NC}"
echo ""

# Create comprehensive backup before any changes
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../workspace_analysis_backup_${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

echo -e "${YELLOW}📦 Creating safety backup...${NC}"
cp -r . "${BACKUP_DIR}/" 2>/dev/null
echo -e "✅ Backup created at: ${BACKUP_DIR}"
echo ""

# Analyze directory structure
echo -e "${CYAN}🔍 DIRECTORY STRUCTURE SCAN${NC}"
echo "Root level contents:"
ls -la | grep "^d" | awk '{print "  📁 " $9}'
echo ""

# Check for nested shoppingcart directory
if [ -d "./shoppingcart" ]; then
    echo -e "${YELLOW}⚠️  NESTED DIRECTORY FOUND: ./shoppingcart${NC}"
    echo "Nested directory contents:"
    ls -la ./shoppingcart | grep "^d" | awk '{print "  📁 " $9}'
    echo ""
    
    # File comparison analysis
    echo -e "${CYAN}📊 CRITICAL FILE COMPARISON ANALYSIS${NC}"
    echo ""
    
    # Compare package.json files
    echo -e "${BLUE}1. PACKAGE.JSON COMPARISON${NC}"
    if [ -f "package.json" ] && [ -f "./shoppingcart/package.json" ]; then
        ROOT_NAME=$(grep '"name"' package.json | head -1)
        NESTED_NAME=$(grep '"name"' ./shoppingcart/package.json | head -1)
        
        echo "  Root package.json: $ROOT_NAME"
        echo "  Nested package.json: $NESTED_NAME"
        
        # Check file timestamps
        ROOT_TIME=$(stat -f "%m" package.json 2>/dev/null || stat -c "%Y" package.json 2>/dev/null)
        NESTED_TIME=$(stat -f "%m" ./shoppingcart/package.json 2>/dev/null || stat -c "%Y" ./shoppingcart/package.json 2>/dev/null)
        
        if [ "$ROOT_TIME" -gt "$NESTED_TIME" ]; then
            echo -e "  🕒 Root package.json is ${GREEN}NEWER${NC}"
            NEWER_PACKAGE="root"
        else
            echo -e "  🕒 Nested package.json is ${GREEN}NEWER${NC}"
            NEWER_PACKAGE="nested"
        fi
        
        # Check for differences
        if diff -q package.json ./shoppingcart/package.json >/dev/null 2>&1; then
            echo -e "  ✅ ${GREEN}Files are IDENTICAL${NC}"
            PACKAGE_ACTION="remove_nested"
        else
            echo -e "  ⚠️  ${YELLOW}Files are DIFFERENT${NC}"
            PACKAGE_ACTION="manual_review"
        fi
    else
        echo -e "  ❌ ${RED}Missing package.json in one location${NC}"
        PACKAGE_ACTION="copy_existing"
    fi
    echo ""
    
    # Compare src directories
    echo -e "${BLUE}2. SOURCE CODE COMPARISON (src/)${NC}"
    if [ -d "src" ] && [ -d "./shoppingcart/src" ]; then
        ROOT_SRC_COUNT=$(find src -type f | wc -l)
        NESTED_SRC_COUNT=$(find ./shoppingcart/src -type f | wc -l)
        
        echo "  Root src/ files: $ROOT_SRC_COUNT"
        echo "  Nested src/ files: $NESTED_SRC_COUNT"
        
        # Check for key backend files following Backend Structure
        echo "  Key backend files comparison:"
        for key_file in "index.ts" "controllers/authController.ts" "services/dropshipping/DropshippingService.ts"; do
            ROOT_EXISTS=$([ -f "src/$key_file" ] && echo "✅" || echo "❌")
            NESTED_EXISTS=$([ -f "./shoppingcart/src/$key_file" ] && echo "✅" || echo "❌")
            echo "    $key_file: Root $ROOT_EXISTS | Nested $NESTED_EXISTS"
        done
        
        if [ "$ROOT_SRC_COUNT" -gt "$NESTED_SRC_COUNT" ]; then
            echo -e "  🏆 Root src/ has ${GREEN}MORE FILES${NC}"
            SRC_ACTION="keep_root"
        else
            echo -e "  🏆 Nested src/ has ${GREEN}MORE FILES${NC}"
            SRC_ACTION="merge_needed"
        fi
    elif [ -d "src" ]; then
        echo -e "  ✅ Root src/ exists, nested missing"
        SRC_ACTION="keep_root"
    elif [ -d "./shoppingcart/src" ]; then
        echo -e "  ⚠️  Only nested src/ exists"
        SRC_ACTION="move_to_root"
    else
        echo -e "  ❌ No src/ directory found"
        SRC_ACTION="none"
    fi
    echo ""
    
    # Compare frontend directories
    echo -e "${BLUE}3. FRONTEND COMPARISON (frontend/)${NC}"
    if [ -d "frontend" ] && [ -d "./shoppingcart/frontend" ]; then
        ROOT_FRONTEND_COUNT=$(find frontend -name "*.tsx" -o -name "*.ts" | wc -l)
        NESTED_FRONTEND_COUNT=$(find ./shoppingcart/frontend -name "*.tsx" -o -name "*.ts" | wc -l)
        
        echo "  Root frontend/ files: $ROOT_FRONTEND_COUNT"
        echo "  Nested frontend/ files: $NESTED_FRONTEND_COUNT"
        
        # Check for key frontend files following Frontend Structure
        echo "  Key frontend files comparison:"
        for key_file in "app/layout.tsx" "context/CartContext.tsx" "lib/api.ts" "app/debug/page.tsx"; do
            ROOT_EXISTS=$([ -f "frontend/$key_file" ] && echo "✅" || echo "❌")
            NESTED_EXISTS=$([ -f "./shoppingcart/frontend/$key_file" ] && echo "✅" || echo "❌")
            echo "    $key_file: Root $ROOT_EXISTS | Nested $NESTED_EXISTS"
        done
        
        if [ "$ROOT_FRONTEND_COUNT" -gt "$NESTED_FRONTEND_COUNT" ]; then
            echo -e "  🏆 Root frontend/ has ${GREEN}MORE FILES${NC}"
            FRONTEND_ACTION="keep_root"
        else
            echo -e "  🏆 Nested frontend/ has ${GREEN}MORE FILES${NC}"
            FRONTEND_ACTION="merge_needed"
        fi
    elif [ -d "frontend" ]; then
        echo -e "  ✅ Root frontend/ exists, nested missing"
        FRONTEND_ACTION="keep_root"
    elif [ -d "./shoppingcart/frontend" ]; then
        echo -e "  ⚠️  Only nested frontend/ exists"
        FRONTEND_ACTION="move_to_root"
    else
        echo -e "  ❌ No frontend/ directory found"
        FRONTEND_ACTION="create_needed"
    fi
    echo ""
    
    # Check .env and configuration files
    echo -e "${BLUE}4. CONFIGURATION FILES COMPARISON${NC}"
    for config_file in ".env" ".env.example" "tsconfig.json" "jest.config.ts"; do
        ROOT_EXISTS=$([ -f "$config_file" ] && echo "✅" || echo "❌")
        NESTED_EXISTS=$([ -f "./shoppingcart/$config_file" ] && echo "✅" || echo "❌")
        echo "  $config_file: Root $ROOT_EXISTS | Nested $NESTED_EXISTS"
    done
    echo ""
    
    # Generate fix strategy
    echo -e "${PURPLE}🎯 RECOMMENDED FIX STRATEGY${NC}"
    echo ""
    
    case "$PACKAGE_ACTION" in
        "remove_nested")
            echo -e "${GREEN}📦 Package.json: Files identical, safe to remove nested${NC}"
            ;;
        "manual_review")
            echo -e "${YELLOW}📦 Package.json: Manual review needed - files differ${NC}"
            ;;
        "copy_existing")
            echo -e "${BLUE}📦 Package.json: Copy from existing location${NC}"
            ;;
    esac
    
    case "$SRC_ACTION" in
        "keep_root")
            echo -e "${GREEN}🔧 Backend: Keep root src/, remove nested${NC}"
            ;;
        "move_to_root")
            echo -e "${BLUE}🔧 Backend: Move nested src/ to root${NC}"
            ;;
        "merge_needed")
            echo -e "${YELLOW}🔧 Backend: Merge needed - nested has more files${NC}"
            ;;
    esac
    
    case "$FRONTEND_ACTION" in
        "keep_root")
            echo -e "${GREEN}🎨 Frontend: Keep root frontend/, remove nested${NC}"
            ;;
        "move_to_root")
            echo -e "${BLUE}🎨 Frontend: Move nested frontend/ to root${NC}"
            ;;
        "merge_needed")
            echo -e "${YELLOW}🎨 Frontend: Merge needed - nested has more files${NC}"
            ;;
        "create_needed")
            echo -e "${RED}🎨 Frontend: Create new frontend structure${NC}"
            ;;
    esac
    echo ""
    
    # Prompt for action
    echo -e "${CYAN}🚀 AUTOMATED FIX OPTIONS${NC}"
    echo ""
    echo "1. Safe Remove (only if files are identical/root is better)"
    echo "2. Smart Merge (combine best from both locations)"
    echo "3. Manual Review (show differences and let you decide)"
    echo "4. Backup Only (no changes, just preserve current state)"
    echo ""
    
    read -p "Choose fix option (1-4): " -n 1 -r FIX_OPTION
    echo ""
    echo ""
    
    case $FIX_OPTION in
        1)
            echo -e "${GREEN}🔧 EXECUTING SAFE REMOVE STRATEGY${NC}"
            
            # Only remove if we determined it's safe
            if [ "$PACKAGE_ACTION" = "remove_nested" ] && [ "$SRC_ACTION" = "keep_root" ] && [ "$FRONTEND_ACTION" = "keep_root" ]; then
                echo "✅ All checks passed for safe removal"
                echo "🗑️  Removing nested shoppingcart directory..."
                rm -rf ./shoppingcart
                echo -e "${GREEN}✅ Nested directory safely removed${NC}"
            else
                echo -e "${YELLOW}⚠️  Safe removal conditions not met, switching to backup mode${NC}"
                echo "❌ Manual review recommended"
            fi
            ;;
            
        2)
            echo -e "${BLUE}🔧 EXECUTING SMART MERGE STRATEGY${NC}"
            
            # Create merge directory
            MERGE_DIR="./merged_$(date +%s)"
            mkdir -p "$MERGE_DIR"
            
            echo "📁 Creating merged structure in $MERGE_DIR"
            
            # Merge package.json (use newer one)
            if [ "$NEWER_PACKAGE" = "root" ]; then
                cp package.json "$MERGE_DIR/"
                echo "  📦 Used root package.json (newer)"
            else
                cp ./shoppingcart/package.json "$MERGE_DIR/"
                echo "  📦 Used nested package.json (newer)"
            fi
            
            # Merge src directories
            if [ -d "src" ] && [ -d "./shoppingcart/src" ]; then
                echo "  🔧 Merging src directories..."
                cp -r src "$MERGE_DIR/"
                rsync -av ./shoppingcart/src/ "$MERGE_DIR/src/" --exclude='node_modules'
                echo "  ✅ Backend files merged"
            elif [ -d "src" ]; then
                cp -r src "$MERGE_DIR/"
                echo "  ✅ Used root src/"
            elif [ -d "./shoppingcart/src" ]; then
                cp -r ./shoppingcart/src "$MERGE_DIR/"
                echo "  ✅ Used nested src/"
            fi
            
            # Merge frontend directories
            if [ -d "frontend" ] && [ -d "./shoppingcart/frontend" ]; then
                echo "  🎨 Merging frontend directories..."
                cp -r frontend "$MERGE_DIR/"
                rsync -av ./shoppingcart/frontend/ "$MERGE_DIR/frontend/" --exclude='node_modules' --exclude='.next'
                echo "  ✅ Frontend files merged"
            elif [ -d "frontend" ]; then
                cp -r frontend "$MERGE_DIR/"
                echo "  ✅ Used root frontend/"
            elif [ -d "./shoppingcart/frontend" ]; then
                cp -r ./shoppingcart/frontend "$MERGE_DIR/"
                echo "  ✅ Used nested frontend/"
            fi
            
            # Copy other important files
            for file in ".env" ".env.example" "tsconfig.json" "jest.config.ts" ".gitignore" "README.md"; do
                if [ -f "$file" ]; then
                    cp "$file" "$MERGE_DIR/"
                elif [ -f "./shoppingcart/$file" ]; then
                    cp "./shoppingcart/$file" "$MERGE_DIR/"
                fi
            done
            
            echo ""
            echo -e "${GREEN}✅ Merge completed in $MERGE_DIR${NC}"
            echo ""
            echo "�� Review the merged structure:"
            echo "  cd $MERGE_DIR"
            echo "  ls -la"
            echo ""
            echo "🚀 If satisfied, replace current structure:"
            echo "  mv $MERGE_DIR/* ."
            echo "  mv $MERGE_DIR/.* . 2>/dev/null || true"
            echo "  rmdir $MERGE_DIR"
            echo "  rm -rf ./shoppingcart"
            ;;
            
        3)
            echo -e "${YELLOW}🔧 MANUAL REVIEW MODE${NC}"
            
            echo ""
            echo "📋 File differences for manual review:"
            echo ""
            
            # Show package.json differences
            if [ -f "package.json" ] && [ -f "./shoppingcart/package.json" ]; then
                echo -e "${BLUE}Package.json differences:${NC}"
                diff -u package.json ./shoppingcart/package.json || true
                echo ""
            fi
            
            # Show directory size comparisons
            echo -e "${BLUE}Directory size comparison:${NC}"
            if [ -d "src" ]; then
                echo "Root src/: $(du -sh src 2>/dev/null | cut -f1)"
            fi
            if [ -d "./shoppingcart/src" ]; then
                echo "Nested src/: $(du -sh ./shoppingcart/src 2>/dev/null | cut -f1)"
            fi
            if [ -d "frontend" ]; then
                echo "Root frontend/: $(du -sh frontend 2>/dev/null | cut -f1)"
            fi
            if [ -d "./shoppingcart/frontend" ]; then
                echo "Nested frontend/: $(du -sh ./shoppingcart/frontend 2>/dev/null | cut -f1)"
            fi
            
            echo ""
            echo "🔍 Recommended manual steps:"
            echo "1. Compare critical files manually"
            echo "2. Keep the version with more recent changes"
            echo "3. Test with: npm run dev:all"
            echo "4. Remove the older version when satisfied"
            ;;
            
        4)
            echo -e "${PURPLE}📦 BACKUP ONLY MODE${NC}"
            echo "✅ Comprehensive backup already created"
            echo "📁 Location: $BACKUP_DIR"
            echo "🔍 No changes made to current structure"
            ;;
            
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            ;;
    esac
    
else
    echo -e "${GREEN}✅ NO NESTED DIRECTORY FOUND${NC}"
    echo "Current structure appears correct for Critical Development Workflows"
fi

echo ""
echo -e "${PURPLE}🛡️  WORKSPACE ANALYSIS COMPLETE${NC}"
echo ""
echo -e "${BLUE}📋 NEXT STEPS following Critical Development Workflows:${NC}"
echo "1. Verify structure: ls -la"
echo "2. Install dependencies: npm run setup"
echo "3. Start development: npm run dev:all"
echo "4. Test Primary Debug Dashboard: http://localhost:3001/debug"
echo "5. Test API Health: curl http://localhost:3000/health"
echo ""
echo -e "${GREEN}💡 Backup preserved at: $BACKUP_DIR${NC}"
