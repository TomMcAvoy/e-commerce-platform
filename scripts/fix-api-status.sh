#!/bin/bash
# filepath: ./fix-api-status.sh

# ==============================================================================
# This script fixes the backend server by adding the /api/status endpoint,
# which is required for the './manage-dev.sh status' health check to pass.
# ==============================================================================

set -e

INDEX_FILE="src/index.ts"
ANCHOR_LINE="app.use('/api', apiRoutes);"
STATUS_ENDPOINT_SIGNATURE="/api/status"

echo "🚀 Fixing the API server..."

# --- 1. Check if the file exists ---
if [ ! -f "$INDEX_FILE" ]; then
  echo "❌ Error: The server entrypoint file was not found at '$INDEX_FILE'."
  exit 1
fi

# --- 2. Check if the fix is already applied ---
if grep -q "$STATUS_ENDPOINT_SIGNATURE" "$INDEX_FILE"; then
  echo "✅ The '$STATUS_ENDPOINT_SIGNATURE' endpoint already exists. No changes needed."
  exit 0
fi

# --- 3. Define the code to be inserted ---
CODE_TO_INSERT=$(cat <<'EOF'

// API Status Endpoint - Following Copilot Debug Patterns
app.get('/api/status', (req, res) => {
  const routes = app._router.stack
    .filter(middleware => middleware.route) // filter for routes
    .map(middleware => ({
      path: middleware.route.path,
      methods: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
    }));

  res.status(200).json({
    success: true,
    message: 'API is running and routes are available.',
    data: routes,
  });
});

EOF
)

# --- 4. Insert the code into the file ---
echo "🔧 Inserting the /api/status endpoint into $INDEX_FILE..."

# Create a temporary file to hold the new content
TMP_FILE=$(mktemp)

# Use awk to insert the code block before the main API routes are mounted
awk -v code="$CODE_TO_INSERT" -v anchor="$ANCHOR_LINE" '
  $0 ~ anchor {
    print code
  }
  {
    print
  }
' "$INDEX_FILE" > "$TMP_FILE"

# Replace the original file with the modified one
mv "$TMP_FILE" "$INDEX_FILE"

echo ""
echo "✅ Success! The API server has been patched."
echo "--------------------------------------------"
echo "To apply the changes, please restart your development server."
echo "You can use './manage-dev.sh restart' or restart it manually."
echo ""
