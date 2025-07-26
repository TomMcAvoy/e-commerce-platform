#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/check-and-create-frontend.sh

echo "🔍 Checking existing frontend structure following Copilot Instructions..."
echo "📁 Working directory: $(pwd)"

# Colors for output following Project-Specific Conventions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Arrays to track files following Architecture Patterns
declare -a EXISTING_FILES=()
declare -a MISSING_FILES=()
declare -a CONTENT_NEEDED=()

check_file() {
    local filepath="$1"
    local description="$2"
    
    if [ -f "$filepath" ]; then
        # Check if file has substantial content (more than just empty or basic structure)
        local file_size=$(wc -c < "$filepath" 2>/dev/null || echo "0")
        local line_count=$(wc -l < "$filepath" 2>/dev/null || echo "0")
        
        if [ "$file_size" -gt 100 ] && [ "$line_count" -gt 5 ]; then
            echo -e "  ✅ ${GREEN}EXISTS & HAS CONTENT${NC} - $filepath ($description)"
            EXISTING_FILES+=("$filepath")
        else
            echo -e "  📝 ${YELLOW}EXISTS BUT EMPTY${NC} - $filepath ($description)"
            CONTENT_NEEDED+=("$filepath")
        fi
    else
        echo -e "  ❌ ${RED}MISSING${NC} - $filepath ($description)"
        MISSING_FILES+=("$filepath")
    fi
}

echo -e "${BLUE}📋 CHECKING CORE APP STRUCTURE (App Router)${NC}"
check_file "frontend/app/layout.tsx" "Root layout with CartProvider"
check_file "frontend/app/page.tsx" "Homepage with category showcase"
check_file "frontend/app/globals.css" "Global Tailwind styles"

echo -e "\n${BLUE}📋 CHECKING CATEGORY SYSTEM (Following API Endpoints Structure)${NC}"
check_file "frontend/app/categories/page.tsx" "Categories grid page"
check_file "frontend/app/categories/loading.tsx" "Loading state for categories"
check_file "frontend/app/categories/error.tsx" "Error boundary for categories"
check_file "frontend/app/category/[slug]/page.tsx" "Dynamic category page"
check_file "frontend/app/category/[slug]/loading.tsx" "Category loading state"
check_file "frontend/app/category/[slug]/error.tsx" "Category error boundary"
check_file "frontend/app/category/[slug]/not-found.tsx" "Category 404 page"

echo -e "\n${BLUE}📋 CHECKING CART SYSTEM (Following Authentication Flow)${NC}"
check_file "frontend/app/cart/page.tsx" "Shopping cart page"
check_file "frontend/app/cart/checkout/page.tsx" "Checkout flow"
check_file "frontend/context/CartContext.tsx" "Cart state management"

echo -e "\n${BLUE}📋 CHECKING CONTEXT PROVIDERS (Following Context Pattern)${NC}"
check_file "frontend/context/AuthContext.tsx" "Authentication context"

echo -e "\n${BLUE}�� CHECKING API INTEGRATION (Following Cross-Service Communication)${NC}"
check_file "frontend/lib/api.ts" "Centralized API calls"
check_file "frontend/lib/auth.ts" "Authentication utilities"
check_file "frontend/lib/cart.ts" "Cart API functions"

echo -e "\n${BLUE}📋 CHECKING TYPE DEFINITIONS (Following Database Patterns)${NC}"
check_file "frontend/types/category.ts" "Category type definitions"
check_file "frontend/types/product.ts" "Product type definitions"
check_file "frontend/types/vendor.ts" "Vendor type definitions"
check_file "frontend/types/user.ts" "User type definitions"
check_file "frontend/types/cart.ts" "Cart type definitions"
check_file "frontend/types/order.ts" "Order type definitions"

echo -e "\n${BLUE}📋 CHECKING UI COMPONENTS (Following Component Organization)${NC}"
check_file "frontend/components/CategoryCard.tsx" "Category display component"
check_file "frontend/components/CategoryNav.tsx" "Category navigation"
check_file "frontend/components/ProductCard.tsx" "Product display component"
check_file "frontend/components/CartButton.tsx" "Add to cart button"
check_file "frontend/components/CartSummary.tsx" "Cart summary display"
check_file "frontend/components/SearchBar.tsx" "Product search component"
check_file "frontend/components/VendorCard.tsx" "Vendor display component"
check_file "frontend/components/Header.tsx" "Main header component"
check_file "frontend/components/Footer.tsx" "Footer component"
check_file "frontend/components/LoadingSpinner.tsx" "Loading indicator"
check_file "frontend/components/ErrorBoundary.tsx" "Error boundary component"

echo -e "\n${BLUE}📋 CHECKING DEBUG SYSTEM (Following Debugging & Testing Ecosystem)${NC}"
check_file "frontend/app/debug/page.tsx" "Primary Debug Dashboard"
check_file "frontend/public/debug-api.html" "Static debug page for CORS testing"

echo -e "\n${BLUE}📋 CHECKING CONFIGURATION FILES${NC}"
check_file "frontend/next.config.js" "Next.js configuration"
check_file "frontend/tailwind.config.js" "Tailwind CSS configuration"
check_file "frontend/postcss.config.js" "PostCSS configuration"
check_file "frontend/package.json" "Frontend dependencies"

# Summary and action plan
echo -e "\n${PURPLE}📊 SUMMARY REPORT${NC}"
echo -e "✅ ${GREEN}Files with content: ${#EXISTING_FILES[@]}${NC}"
echo -e "📝 ${YELLOW}Files needing content: ${#CONTENT_NEEDED[@]}${NC}"
echo -e "❌ ${RED}Missing files: ${#MISSING_FILES[@]}${NC}"

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "\n${RED}🚀 CREATING MISSING FILES${NC}"
    
    # Create missing directories first
    mkdir -p frontend/app/categories
    mkdir -p frontend/app/category/[slug]
    mkdir -p frontend/app/cart/checkout
    mkdir -p frontend/app/debug
    mkdir -p frontend/components/Layout
    mkdir -p frontend/components/Forms
    mkdir -p frontend/components/UI
    mkdir -p frontend/context
    mkdir -p frontend/lib
    mkdir -p frontend/types
    mkdir -p frontend/public
    
    # Create missing files
    for file in "${MISSING_FILES[@]}"; do
        touch "$file"
        echo -e "  ✅ Created: $file"
    done
fi

# Create action lists for existing but empty files
if [ ${#CONTENT_NEEDED[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}📝 FILES NEEDING CONTENT (copy-paste ready paths):${NC}"
    for file in "${CONTENT_NEEDED[@]}"; do
        echo "$file"
    done
fi

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "\n${RED}📋 NEWLY CREATED FILES (copy-paste ready paths):${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "$file"
    done
fi

# Generate priority list following Critical Development Workflows
echo -e "\n${BLUE}🎯 PRIORITY IMPLEMENTATION ORDER (Following Architecture Patterns):${NC}"
echo ""
echo -e "${YELLOW}Phase 1 - Core Foundation:${NC}"
echo "  1. frontend/app/layout.tsx (Root layout with CartProvider)"
echo "  2. frontend/context/CartContext.tsx (Cart state management)"
echo "  3. frontend/types/category.ts (Type definitions)"
echo "  4. frontend/lib/api.ts (API integration)"
echo ""
echo -e "${YELLOW}Phase 2 - Category System:${NC}"
echo "  5. frontend/components/CategoryCard.tsx (Category display)"
echo "  6. frontend/components/CategoryNav.tsx (Navigation)"
echo "  7. frontend/app/categories/page.tsx (Categories grid)"
echo "  8. frontend/app/category/[slug]/page.tsx (Dynamic category pages)"
echo ""
echo -e "${YELLOW}Phase 3 - Cart & Commerce:${NC}"
echo "  9. frontend/components/CartButton.tsx (Add to cart)"
echo "  10. frontend/app/cart/page.tsx (Shopping cart)"
echo "  11. frontend/components/ProductCard.tsx (Product display)"
echo ""
echo -e "${YELLOW}Phase 4 - Debug & Testing:${NC}"
echo "  12. frontend/app/debug/page.tsx (Primary Debug Dashboard)"
echo "  13. frontend/public/debug-api.html (Static debug page)"
echo ""

# Generate VS Code workspace command
echo -e "${BLUE}🔧 VS Code Quick Commands:${NC}"
echo ""
echo "# Open all priority files in VS Code:"
if [ ${#CONTENT_NEEDED[@]} -gt 0 ] || [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "code \\"
    # Combine and sort priority files
    for file in "frontend/app/layout.tsx" "frontend/context/CartContext.tsx" "frontend/types/category.ts" "frontend/lib/api.ts" "frontend/components/CategoryCard.tsx" "frontend/app/categories/page.tsx"; do
        if [[ " ${CONTENT_NEEDED[@]} " =~ " ${file} " ]] || [[ " ${MISSING_FILES[@]} " =~ " ${file} " ]]; then
            echo "  $file \\"
        fi
    done | sed '$ s/ \\$//'
fi

echo ""
echo -e "${GREEN}🚀 NEXT STEPS following Critical Development Workflows:${NC}"
echo ""
echo "1. Review the priority implementation order above"
echo "2. Use the copy-paste file paths to add content"
echo "3. Test with: npm run dev:all"
echo "4. Debug with: http://localhost:3001/debug"
echo "5. Validate API: curl http://localhost:3000/api/categories"
echo ""
echo -e "${PURPLE}💡 Pro tip: Start with Phase 1 files for a working foundation!${NC}"
