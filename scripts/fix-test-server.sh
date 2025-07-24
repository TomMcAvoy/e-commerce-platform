#!/bin/bash
# filepath: ./fix-test-server.sh

# ==============================================================================
# This script fixes the test suite failures by restructuring the main server
# file (src/index.ts) to be testable with Jest and Supertest.
# It separates the app's creation from its listening process.
# ==============================================================================

set -e

INDEX_FILE="src/index.ts"
TMP_FILE=$(mktemp)

echo "🚀 Making the Express server testable..."

# --- 1. Check if the file exists ---
if [ ! -f "$INDEX_FILE" ]; then
  echo "❌ Error: The server entrypoint file was not found at '$INDEX_FILE'."
  exit 1
fi

# --- 2. Check if the fix is already applied ---
if grep -q "export default app;" "$INDEX_FILE"; then
  echo "✅ Server file '$INDEX_FILE' already appears to be testable. No changes needed."
  exit 0
fi

echo "🔧 Restructuring '$INDEX_FILE' for testing..."

# --- 3. Separate the app logic from the server listener ---
# This awk script will find the line with `app.listen` and move it
# to the end of the file, wrapping it in a conditional block,
# and adds the crucial `export default app;` line.

awk '
  /app\.listen\(|server\.listen\(/ {
    listen_block = $0;
    while (getline > 0 && !/^\s*\}\);?\s*$/) {
      listen_block = listen_block "\n" $0;
    }
    listen_block = listen_block "\n" $0;
    next;
  }
  { print }
  END {
    print "\n// Export the app for testing purposes";
    print "export default app;\n";
    print "// Start the server only if the file is run directly";
    print "if (process.env.NODE_ENV !== \x27test\x27) {";
    print listen_block;
    print "}";
  }
' "$INDEX_FILE" > "$TMP_FILE"

# --- 4. Replace the original file with the modified one ---
mv "$TMP_FILE" "$INDEX_FILE"

echo ""
echo "✅ Success! The server has been restructured."
echo "--------------------------------------------"
echo "The 'TypeError: app.address is not a function' and '404' errors should now be resolved."
echo "Please run the tests again."
echo ""
echo "   npm test"
echo ""
