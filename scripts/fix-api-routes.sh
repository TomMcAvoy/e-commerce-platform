#!/bin/bash
# filepath: ./fix-api-routes.sh

# ==============================================================================
# This script fixes the widespread '404 Not Found' errors in the test suite.
# It ensures all API routes are correctly aggregated and mounted by the main
# Express application.
# ==============================================================================

set -e

INDEX_FILE="src/index.ts"
ROUTES_DIR="src/routes"
ROUTES_INDEX_FILE="$ROUTES_DIR/index.ts"
GLOBAL_ROUTER_MOUNT="app.use('/api', apiRoutes);"

echo "🚀 Fixing API route mounting..."

# --- 1. Create a central router file to aggregate all API routes ---
echo "   - Creating central route aggregator at '$ROUTES_INDEX_FILE'..."

# Use a 'here document' to write the content to the new file.
cat > "$ROUTES_INDEX_FILE" << 'EOF'
import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import userRoutes from './userRoutes';
import vendorRoutes from './vendorRoutes';
import categoryRoutes from './categoryRoutes';
import dropshippingRoutes from './dropshippingRoutes';

const router = Router();

// Mount all the individual routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/categories', categoryRoutes);
router.use('/dropshipping', dropshippingRoutes);

export default router;
EOF

echo "   - Central route aggregator created successfully."

# --- 2. Modify the main server file to use the central router ---
echo "   - Updating '$INDEX_FILE' to mount all API routes..."

# Check if the routes are already mounted. If not, add the line.
if ! grep -q "$GLOBAL_ROUTER_MOUNT" "$INDEX_FILE"; then
  # We need to find a good place to insert the mounting logic.
  # Before the global error handler is a safe bet.
  ANCHOR_LINE="app.all('*'"
  IMPORT_LINE="import apiRoutes from './routes';"
  MOUNT_LINE="app.use('/api', apiRoutes);"

  # Use awk to insert the import at the top and the mount logic before the anchor
  awk -v import="$IMPORT_LINE" -v mount="$MOUNT_LINE" -v anchor="$ANCHOR_LINE" '
    NR==1 {print import}
    $0 ~ anchor {
      print "\n// Mount all API routes from the central router";
      print mount;
      print "";
    }
    {print}
  ' "$INDEX_FILE" > "${INDEX_FILE}.tmp" && mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

  echo "   - Successfully mounted routes in '$INDEX_FILE'."
else
  echo "   - Routes already appear to be mounted in '$INDEX_FILE'."
fi

echo ""
echo "✅ Success! The API routing structure has been fixed."
echo "------------------------------------------------------"
echo "The '404 Not Found' errors should now be resolved."
echo "Please run the tests again."
echo ""
echo "   npm test"
echo ""
