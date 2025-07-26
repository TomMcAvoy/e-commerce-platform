import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  name: string;
  slug: string;
  plan: "basic" | "premium" | "enterprise";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      default: "basic",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITenant>("Tenant", TenantSchema);

