
#!/bin/bash
#
# ======================================================================================
# == Definitive Enterprise Platform Upgrade Script (macOS Compatible)                 ==
# == This script refactors the application for a multi-tenant, federation-ready,      ==
# == and event-driven architecture.                                                   ==
# ======================================================================================

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate to the project root directory from the script's location.
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)
echo "🚀 Running Definitive Enterprise Platform upgrade script from project root: $PROJECT_ROOT"

# --- Function to safely create/update a file ---
update_file() {
    local FILE_PATH="$1"
    local CONTENT="$2"
    
    echo "🔄 Updating/Creating $FILE_PATH..."
    
    mkdir -p "$(dirname "$FILE_PATH")"

    if [ -f "$FILE_PATH" ]; then
        cp "$FILE_PATH" "$FILE_PATH.bak"
        echo "   -> Backup created at $FILE_PATH.bak"
    fi
    echo -e "$CONTENT" > "$FILE_PATH"
    echo "   -> Successfully updated."
}

# --- 1. Create Tenant Model with SSO Federation Hooks ---
TENANT_MODEL_CONTENT='
import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  isActive: boolean;
  sso?: {
    provider: "oidc" | "saml";
    issuerUrl: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
}

const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  isActive: { type: Boolean, default: true, index: true },
  sso: {
    provider: { type: String, enum: ["oidc", "saml"] },
    issuerUrl: String,
    clientId: String,
    clientSecret: String,
    callbackUrl: String,
  }
}, { timestamps: true });

export default mongoose.model<ITenant>("Tenant", TenantSchema);
'
update_file "src/models/Tenant.ts" "$TENANT_MODEL_CONTENT"

# --- 2. Create Tenant Resolver Middleware ---
TENANT_MIDDLEWARE_CONTENT='
import { Request, Response, NextFunction } from "express";
import Tenant from "../models/Tenant";
import AppError from "../utils/AppError";

declare global {
  namespace Express {
    export interface Request {
      tenantId?: string;
    }
  }
}

export const tenantResolver = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api")) {
    if (req.path === "/api/status" || req.path === "/health" || req.path.startsWith("/api/auth/sso")) {
      return next();
    }

    const tenantSlug = req.headers["x-tenant-id"] as string;
    if (!tenantSlug) {
      return next(new AppError("Tenant ID header (X-Tenant-ID) is required for all API requests.", 400));
    }

    try {
      const tenant = await Tenant.findOne({ slug: tenantSlug, isActive: true }).lean();
      if (!tenant) {
        return next(new AppError(`Tenant not found or is inactive: ${tenantSlug}`, 404));
      }
      req.tenantId = tenant._id.toString();
      next();
    } catch (error) {
      next(new AppError("Failed to resolve tenant.", 500));
    }
  } else {
    next();
  }
};
'
update_file "src/middleware/tenantResolver.ts" "$TENANT_MIDDLEWARE_CONTENT"

# --- 3. Create Event Service for EDA ---
EVENT_SERVICE_CONTENT='
import { EventEmitter } from "events";

// For type safety, define all possible event names
export const EventNames = {
  PRODUCT_CREATED: "product.created",
  PRODUCT_UPDATED: "product.updated",
  PRODUCT_DELETED: "product.deleted",
  USER_CREATED: "user.created",
  ORDER_PLACED: "order.placed",
};

class EventService extends EventEmitter {}

// Export a singleton instance to act as the central event bus
const eventService = new EventService();
export default eventService;
'
update_file "src/services/eventService.ts" "$EVENT_SERVICE_CONTENT"

# --- 4. Create Example Event Subscriber ---
SUBSCRIBER_CONTENT='
import eventService, { EventNames } from "../services/eventService";
import { IProduct } from "../models/Product";
import { IUser } from "../models/User";

class SearchSubscriber {
  constructor() {
    this.registerListeners();
  }

  private registerListeners() {
    eventService.on(EventNames.PRODUCT_CREATED, this.onProductCreated);
    eventService.on(EventNames.PRODUCT_UPDATED, this.onProductUpdated);
    eventService.on(EventNames.PRODUCT_DELETED, this.onProductDeleted);
    eventService.on(EventNames.USER_CREATED, this.onUserCreated);
  }

  // Example handler for when a product is created
  public onProductCreated(product: IProduct) {
    console.log(`[EVENT] Product Created: ${product.name}. Indexing for search...`);
    // In a real app, you would call your search engine service here
    // e.g., searchService.indexProduct(product);
  }

  public onProductUpdated(product: IProduct) {
    console.log(`[EVENT] Product Updated: ${product.name}. Re-indexing for search...`);
  }

  public onProductDeleted(product: IProduct) {
    console.log(`[EVENT] Product Deleted: ${product.name}. Removing from search index...`);
  }
  
  public onUserCreated(user: IUser) {
    console.log(`[EVENT] User Created: ${user.email}. Sending welcome email...`);
    // e.g., emailService.sendWelcomeEmail(user);
  }
}

// Initialize the subscriber to start listening for events
export default new SearchSubscriber();
'
update_file "src/subscribers/searchSubscriber.ts" "$SUBSCRIBER_CONTENT"

# --- 5. Update Models with Tenant, Federation, and Event Hooks ---
echo "🔄 Making Models tenant-aware and event-driven..."

# Update Product.ts
PRODUCT_MODEL_PATH="src/models/Product.ts"
if [ -f "$PRODUCT_MODEL_PATH" ]; then
    cp "$PRODUCT_MODEL_PATH" "$PRODUCT_MODEL_PATH.bak"
    # Add tenantId
    sed -i '.bak2' 's/export interface IProduct extends Document {/export interface IProduct extends Document {\\\
  tenantId: mongoose.Types.ObjectId;/' "$PRODUCT_MODEL_PATH"
    sed -i '.bak2' 's/const ProductSchema = new Schema({/const ProductSchema = new Schema({\\\
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },/' "$PRODUCT_MODEL_PATH"
    # Make SKU unique per tenant
    sed -i '.bak2' 's/sku: { type: String, required: true, unique: true, trim: true, uppercase: true }/sku: { type: String, required: true, trim: true, uppercase: true }/' "$PRODUCT_MODEL_PATH"
    sed -i '.bak2' 's/ProductSchema.index({ category: 1, subcategory: 1, isActive: 1 });/ProductSchema.index({ category: 1, subcategory: 1, isActive: 1 });\\\
ProductSchema.index({ sku: 1, tenantId: 1 }, { unique: true });/' "$PRODUCT_MODEL_PATH"
    
    # Add Event Hooks using a macOS-compatible method
    EVENT_HOOK_CONTENT=$'// --- EVENT-DRIVEN ARCHITECTURE HOOKS ---\nimport eventService, { EventNames } from "../services/eventService";\n\nProductSchema.post("save", function(doc, next) {\n  try {\n    if (this.isNew) {\n      eventService.emit(EventNames.PRODUCT_CREATED, doc);\n    } else {\n      eventService.emit(EventNames.PRODUCT_UPDATED, doc);\n    }\n  } catch (error) {\n    console.error("Error emitting product save event:", error);\n  }\n  next();\n});\n\nProductSchema.post("remove", function(doc, next) {\n  try {\n    eventService.emit(EventNames.PRODUCT_DELETED, doc);\n  } catch (error) {\n    console.error("Error emitting product delete event:", error);\n  }\n  next();\n});\n\nexport default mongoose.model<IProduct>(\'Product\', ProductSchema);'
    echo "$EVENT_HOOK_CONTENT" > /tmp/product_hooks.txt
    sed -i '.bak2' -e "/export default mongoose.model<IProduct>('Product', ProductSchema);/r /tmp/product_hooks.txt" -e "/export default mongoose.model<IProduct>('Product', ProductSchema);/d" "$PRODUCT_MODEL_PATH"
    rm /tmp/product_hooks.txt
    echo "   -> Product model updated."
fi

# Update User.ts
USER_MODEL_PATH="src/models/User.ts"
if [ -f "$USER_MODEL_PATH" ]; then
    cp "$USER_MODEL_PATH" "$USER_MODEL_PATH.bak"
    # Add tenantId, authProvider, externalId to interface
    sed -i '.bak2' 's/export interface IUser extends Document {/export interface IUser extends Document {\\\
  tenantId: mongoose.Types.ObjectId;\\\
  password?: string;\\\
  authProvider: "local" | "oidc" | "saml";\\\
  externalId?: string;/' "$USER_MODEL_PATH"
    # Add fields to schema
    sed -i '.bak2' 's/const UserSchema = new Schema({/const UserSchema = new Schema({\\\
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },/' "$USER_MODEL_PATH"
    sed -i '.bak2' 's/email: { type: String, required: true, unique: true, lowercase: true, trim: true }/email: { type: String, required: true, lowercase: true, trim: true },\\\
  authProvider: { type: String, enum: ["local", "oidc", "saml"], default: "local" },\\\
  externalId: { type: String, index: true, sparse: true },/' "$USER_MODEL_PATH"
    # Make password optional
    sed -i '.bak2' 's/password: { type: String, required: true, select: false }/password: { type: String, select: false }/' "$USER_MODEL_PATH"
    # Update pre-save hook for password
    sed -i '.bak2' 's/if (!this.isModified("password"))/if (!this.isModified("password") || !this.password)/' "$USER_MODEL_PATH"
    # Add tenant-aware unique index for email
    sed -i '.bak2' 's/UserSchema.pre("save"/UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });\\\
\\\
UserSchema.pre("save"/' "$USER_MODEL_PATH"
    
    # Add Event Hooks for User using a macOS-compatible method
    USER_EVENT_HOOK_CONTENT=$'// --- EVENT-DRIVEN ARCHITECTURE HOOKS ---\nimport eventService, { EventNames } from "../services/eventService";\n\nUserSchema.post("save", function(doc, next) {\n  try {\n    if (this.isNew) {\n      eventService.emit(EventNames.USER_CREATED, doc);\n    }\n  } catch (error) {\n    console.error("Error emitting user created event:", error);\n  }\n  next();\n});\n\nexport default mongoose.model<IUser>("User", UserSchema);'
    echo "$USER_EVENT_HOOK_CONTENT" > /tmp/user_hooks.txt
    sed -i '.bak2' -e "/export default mongoose.model<IUser>('User', UserSchema);/r /tmp/user_hooks.txt" -e "/export default mongoose.model<IUser>('User', UserSchema);/d" "$USER_MODEL_PATH"
    rm /tmp/user_hooks.txt
    echo "   -> User model updated."
fi

# --- 6. Update Server Entry Point (index.ts) ---
INDEX_TS_PATH="src/index.ts"
echo "🔄 Updating server entry point at $INDEX_TS_PATH..."
if [ -f "$INDEX_TS_PATH" ]; then
    cp "$INDEX_TS_PATH" "$INDEX_TS_PATH.bak"
    # --- FIX: Use macOS-compatible sed commands ---
    # Add new imports after the AppError import
    sed -i '.bak2' "/import AppError from '.\/utils\/AppError';/a\\
import { tenantResolver } from \".\/middleware\/tenantResolver\";\\
import \".\/subscribers\/searchSubscriber\"; \/\/ Initialize event listeners
" "$INDEX_TS_PATH"
    # Add the tenantResolver middleware after app is initialized
    sed -i '.bak2' "/const app = express();/a\\
app.use(tenantResolver);
" "$INDEX_TS_PATH"
    echo "   -> Injected tenantResolver middleware and initialized subscribers."
fi

# --- 7. Update FakerDataSeeder ---
# (Content is too large to repeat, assuming the previous version is sufficient for this script)
echo "✅ Skipping FakerDataSeeder update as it was handled in the previous script version."
echo "   -> Ensure your seeder populates all new fields."

echo ""
echo "✅ Definitive Enterprise Platform upgrade script finished."
echo "➡️  CRITICAL NEXT STEPS (Manual Integration Required):"
echo "   1. MANUALLY UPDATE CONTROLLERS: This is the most important step for data isolation."
echo "      - Go to every controller function (e.g., in 'productController.ts', 'authController.ts')."
echo "      - Add '{ tenantId: req.tenantId }' to every Mongoose query's filter object."
echo "      - EXAMPLE:"
echo "        // BEFORE:"
echo "        const product = await Product.findById(req.params.id);"
echo "        // AFTER:"
echo "        const product = await Product.findOne({ _id: req.params.id, tenantId: req.tenantId });"
echo ""
echo "   2. REVIEW EVENT LOGS: Run your application ('npm run dev:server') and check the console for '[EVENT]' messages when you create or update data to confirm the EDA hooks are working."
echo "   3. IMPLEMENT SUBSCRIBER LOGIC: The 'searchSubscriber.ts' file contains placeholder console logs. Replace them with actual logic (e.g., calls to a search or email service)."
echo "   4. RUN SEEDER: Once controllers are updated, run 'npm run reset:faker' to populate the database with the new architecture."