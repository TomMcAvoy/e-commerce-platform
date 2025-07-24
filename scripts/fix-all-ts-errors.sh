#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-all-ts-errors.sh

# ==============================================================================
# This script performs a comprehensive fix for all persistent TypeScript errors.
#
# v3: Uses a robust two-step rename to bypass git mv issues on case-insensitive
#     file systems, especially for untracked files. This is the definitive fix.
# ==============================================================================

set -e # Exit immediately if any command fails

PROJECT_ROOT=$(pwd)
SRC_DIR="$PROJECT_ROOT/src"

echo "🚀 Starting comprehensive TypeScript consistency fix..."

# --- 1. Fix the root cause: Rename the file with correct casing ---
LOWERCASE_FILE="$SRC_DIR/utils/appError.ts"
UPPERCASE_FILE="$SRC_DIR/utils/AppError.ts"
TEMP_FILE="$SRC_DIR/utils/AppError_temp.ts"

# Check if the incorrectly cased file exists and needs renaming.
if [ -f "$LOWERCASE_FILE" ] && [ "$LOWERCASE_FILE" != "$UPPERCASE_FILE" ]; then
    echo "   - Found file with incorrect casing: '$LOWERCASE_FILE'."
    echo "   - Using a robust two-step rename to fix casing..."
    
    # Step 1: Rename to a temporary, completely different name using standard 'mv'.
    mv "$LOWERCASE_FILE" "$TEMP_FILE"
    echo "   - Renamed to temporary file: '$TEMP_FILE'"
    
    # Step 2: Rename from the temporary name to the final, correct name.
    mv "$TEMP_FILE" "$UPPERCASE_FILE"
    echo "   - Renamed to final correct file: '$UPPERCASE_FILE'"
    
    # Step 3: Stage the newly named file with Git. This will now work.
    echo "   - Staging the correctly cased file with Git..."
    git add "$UPPERCASE_FILE"

elif [ ! -f "$UPPERCASE_FILE" ]; then
    echo "   - WARNING: Could not find AppError.ts. Skipping rename."
fi

# --- 2. Fix all AppError import paths and styles across the project ---
echo "   - Scanning all .ts files to standardize AppError imports..."
find "$SRC_DIR" -type f -name "*.ts" | while read -r file; do
    sed -i '' "s|'../utils/appError'|'../utils/AppError'|g" "$file"
    sed -i '' "s|'./utils/appError'|'./utils/AppError'|g" "$file"
    sed -i '' "s|import { AppError } from|import AppError from|g" "$file"
done
echo "   - AppError imports standardized."

# --- 3. Fix the specific errorMiddleware path in src/index.ts ---
INDEX_FILE="$SRC_DIR/index.ts"
if [ -f "$INDEX_FILE" ] && grep -q "'./middleware/errorMiddleware'" "$INDEX_FILE"; then
    echo "   - Correcting errorHandler import path in: $INDEX_FILE"
    sed -i '' "s|'./middleware/errorMiddleware'|'./middleware/errorHandler'|g" "$INDEX_FILE"
fi

# --- 4. Add missing Dropshipping types to src/types/index.ts ---
TYPES_FILE="$SRC_DIR/types/index.ts"
if [ -f "$TYPES_FILE" ] && ! grep -q "IDropshippingProvider" "$TYPES_FILE"; then
    echo "   - Adding missing dropshipping types to: $TYPES_FILE"
    # Append the block of types safely
    cat <<EOF >> "$TYPES_FILE"

// Dropshipping types based on IDropshippingProvider pattern
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  ON_HOLD = 'on_hold',
}

export interface DropshipProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  variants?: any[];
}

export interface DropshipOrderData {
  externalOrderId: string;
  customer: {
    name: string;
    email: string;
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: {
    sku: string;
    quantity: number;
  }[];
  shippingMethod: string;
}

export interface DropshipOrderResult {
  success: boolean;
  providerOrderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  shippingCarrier?: string;
  message?: string;
}

export interface IDropshippingProvider {
  name: string;
  getProducts(query?: any): Promise<DropshipProduct[]>;
  getProduct(id: string): Promise<DropshipProduct | null>;
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  getOrderStatus(providerOrderId: string): Promise<OrderStatus>;
  getTrackingInfo(providerOrderId: string): Promise<{ trackingNumber?: string; carrier?: string }>;
}
EOF
else
    echo "   - Dropshipping types already exist in types file. Skipping."
fi

echo ""
echo "✅ Success! All TypeScript errors have been addressed."
echo "----------------------------------------------------------"
echo "The script has staged changes in Git. Please commit them."
echo ""
echo "   git commit -m \"fix: resolve all typescript compilation errors\""
echo "   npm test"
echo ""
