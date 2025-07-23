
#!/bin/bash

# This script fixes multiple TypeScript and testing errors across the project.
# It is designed for macOS and should be run from the project root directory.

echo "🚀 Starting automated fix process for macOS..."

# --- Fix 1: Remove duplicate 'export' keywords in User.ts ---
# This corrects the "'export' modifier already seen" syntax error.
if grep -q "export export" src/models/User.ts; then
  sed -i '' 's/export export/export/g' src/models/User.ts
  echo "✅ Cleaned up duplicate exports in src/models/User.ts"
else
  echo "ℹ️ No duplicate exports found in src/models/User.ts. Skipping."
fi

# --- Fix 2: Harmonize ShippingAddress type in IDropshippingProvider.ts ---
# This aligns the interface with the one in `types.ts` to fix the type conflict.
# It replaces the old definition with the correct one.
# Note: Using a different delimiter '#' for sed to handle slashes in the replacement string.
sed -i '' \
-e 's#address1: string;#firstName: string;\n  lastName: string;\n  address1: string;#' \
-e 's#zip: string;#postalCode: string;#' \
src/services/dropshipping/IDropshippingProvider.ts
echo "✅ Harmonized ShippingAddress type in src/services/dropshipping/IDropshippingProvider.ts"

# --- Fix 3: Update DropshippingService.test.ts with correct data structure ---
# This adds the missing 'customerEmail' and updates the shipping address to match the new type.
sed -i '' \
-e "s#{ customer: { name: 'Test Customer', email: 'test@example.com' }#{ customer: { name: 'Test Customer', email: 'test@example.com' }, customerEmail: 'test@example.com'#" \
-e "s#shippingAddress: { address1: '123 Main St'#shippingAddress: { firstName: 'Test', lastName: 'User', address1: '123 Main St'#" \
-e "s#zip: '12345'#postalCode: '12345'#" \
src/__tests__/backend/DropshippingService.test.ts
echo "✅ Updated test data in src/__tests__/backend/DropshippingService.test.ts"

echo "🎉 All fixes applied successfully. Please run 'npm test' again."
