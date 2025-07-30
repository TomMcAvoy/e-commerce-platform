import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  tenantId: mongoose.Schema.Types.ObjectId;
  sourceId: string;
  sourceName: string;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string;
  country: string;
  category: string;
  isActive: boolean;
}

const NewsSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  sourceId: { type: String, required: true, index: true },
  sourceName: { type: String, required: true },
  author: { type: String },
  title: { type: String, required: true, unique: true }, // Prevent duplicate articles
  description: { type: String },
  url: { type: String, required: true },
  urlToImage: { type: String },
  publishedAt: { type: Date, required: true, index: true },
  content: { type: String },
  country: { type: String, index: true },
  category: { type: String, default: 'general', index: true },
  isActive: { type: Boolean, default: true, index: true }
}, {
  timestamps: true
});

export default mongoose.model<INews>('News', NewsSchema);