#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-nested-structure.sh

echo "🔧 Fixing nested directory structure following Project-Specific Conventions..."

# Safety check
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root. Navigate to /Users/thomasmcavoy/GitHub/shoppingcart first."
    exit 1
fi

# Check for nested shoppingcart directory
if [ -d "./shoppingcart" ]; then
    echo "⚠️  Found nested shoppingcart directory"
    
    # Create backup
    BACKUP_NAME="shoppingcart.backup.$(date +%s)"
    echo "�� Creating backup: $BACKUP_NAME"
    cp -r ./shoppingcart "./$BACKUP_NAME"
    
    # Compare file dates to determine which is newer
    echo "🔍 Comparing timestamps..."
    
    if [ -f "./shoppingcart/package.json" ]; then
        echo "📝 Nested directory has package.json"
        
        # Show differences
        echo "🔍 Checking for differences..."
        diff -q package.json ./shoppingcart/package.json >/dev/null
        if [ $? -eq 0 ]; then
            echo "✅ Package.json files are identical"
            echo "🗑️  Safe to remove nested directory"
            rm -rf ./shoppingcart
            echo "✅ Nested directory removed"
        else
            echo "⚠️  Package.json files differ"
            echo "📋 Manual review required"
            echo "Root package.json name: $(grep '"name"' package.json)"
            echo "Nested package.json name: $(grep '"name"' ./shoppingcart/package.json)"
        fi
    else
        echo "🗑️  Nested directory has no package.json, removing..."
        rm -rf ./shoppingcart
        echo "✅ Nested directory removed"
    fi
    
else
    echo "✅ No nested directory found"
fi

echo ""
echo "🧹 Cleaning up workspace following Environment & Configuration..."

# Remove any extra node_modules
find . -name "node_modules" -type d -not -path "./node_modules" -not -path "./frontend/node_modules" | while read dir; do
    echo "🗑️  Removing extra node_modules: $dir"
    rm -rf "$dir"
done

# Clean package-lock files
find . -name "package-lock.json" -not -path "./package-lock.json" -not -path "./frontend/package-lock.json" | while read file; do
    echo "🗑️  Removing extra package-lock.json: $file"
    rm -f "$file"
done

echo ""
echo "✅ Workspace structure cleaned!"
echo ""
echo "🚀 Next steps following Critical Development Workflows:"
echo "1. npm run setup"
echo "2. npm run dev:all" 
echo "3. Test: http://localhost:3001/debug"
