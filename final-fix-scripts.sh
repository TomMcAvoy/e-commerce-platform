#!/bin/bash

# This script provides a definitive fix for the TypeScript errors caused by
# previous faulty scripts. It is idempotent and safe to run multiple times.
# Designed for macOS.

echo "🚀 Running the definitive fix script..."

# --- Fix 1: Clean up multiple 'export' keywords in User.ts ---
# This resolves the "error TS1030: 'export' modifier already seen" issue.
echo "🔎 Analyzing src/models/User.ts for syntax errors..."
if grep -q "export export" src/models/User.ts; then
  # Replace any sequence of 'export ' at the beginning of a line with a single 'export '.
  sed -i '' 's/^\(export \)\{1,\}/export /' src/models/User.ts
  echo "✅ Corrected multiple 'export' statements in src/models/User.ts."
else
  echo "ℹ️ src/models/User.ts appears to be clean. No changes needed."
fi

# --- Fix 2: Add missing properties to DropshippingService.test.ts ---
# This resolves the "is missing the following properties...: firstName, lastName" error.
echo "🔎 Analyzing src/__tests__/backend/DropshippingService.test.ts for type errors..."
# We check if the line is missing the required fields before attempting a fix.
if ! grep -q "firstName: 'Test'" src/__tests__/backend/DropshippingService.test.ts; then
  # Add the missing properties to the shippingAddress object in the test data.
  # Using '#' as a delimiter to avoid conflicts with slashes in the code.
  sed -i '' "s#shippingAddress: { address1:#shippingAddress: { firstName: 'Test', lastName: 'User', address1:#" src/__tests__/backend/DropshippingService.test.ts
  echo "✅ Added missing 'firstName' and 'lastName' to test data in DropshippingService.test.ts."
else
  echo "ℹ️ Test data in DropshippingService.test.ts appears correct. No changes needed."
fi

echo "🎉 All fixes have been applied. The codebase should now be consistent."
echo "👉 Please run 'npm test' to verify the results."
