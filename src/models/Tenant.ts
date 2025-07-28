import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
  name: string;
  domain: string;
  isActive: boolean;
}

const TenantSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, "Please add a domain"],
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// This pattern prevents the OverwriteModelError and logs the compilation event.
if (!mongoose.models.Tenant) {
  console.log(`[Model Compilation] Compiling 'Tenant' in src/models/Tenant.ts`);
}
export default mongoose.models.Tenant || mongoose.model<ITenant>("Tenant", TenantSchema);

