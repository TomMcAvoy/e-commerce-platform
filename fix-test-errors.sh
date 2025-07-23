#!/bin/bash
# This script fixes common test failures related to module exports and imports,
# following the patterns in the project's copilot-instructions.md.

set -e

echo "🚀 Applying fixes for test suite errors..."
echo "=========================================="

# --- FIX 1: Add default export to src/index.ts for Supertest ---
echo "1. Patching src/index.ts..."
# Check if the export already exists to prevent duplicates
if grep -q "export default app;" src/index.ts; then
  echo "   ✅ Default export already exists in src/index.ts. No changes needed."
else
  # Add the export to the end of the file
  echo -e "\nexport default app; // Export for testing purposes" >> src/index.ts
  echo "   ✅ Added default export to src/index.ts."
fi

# --- FIX 2: Correct the import style in src/services/cartService.ts ---
echo "2. Patching src/services/cartService.ts..."
# Use sed to replace the incorrect named import with a default import
if [ -f src/services/cartService.ts ]; then
  sed -i.bak "s/import { AppError } from '..\/utils\/AppError';/import AppError from '..\/utils\/AppError';/" src/services/cartService.ts
  rm src/services/cartService.ts.bak # Clean up the backup file
  echo "   ✅ Corrected AppError import in src/services/cartService.ts."
else
    echo "   ⚠️  Warning: src/services/cartService.ts not found. Skipping."
fi


# --- Final Instructions ---
echo ""
echo "✅ Patching complete!"
echo "===================="
echo ""
echo "The script has fixed the module import/export issues."
echo "Now, let's verify the fix by running the tests again."
echo ""
echo "   Run this command in your terminal:"
echo "   npm test"
echo ""
