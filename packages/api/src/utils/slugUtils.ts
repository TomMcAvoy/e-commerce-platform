import { Model } from 'mongoose';
import { createSlugRegex, generateSlug } from '@shoppingcart/shared/src/utils/slugUtils';

/**
 * Ensure a slug is unique within a collection
 * 
 * @param model Mongoose model
 * @param slug Base slug to check
 * @param excludeId Optional ID to exclude from the check (for updates)
 * @param tenantId Optional tenant ID for multi-tenant applications
 * @returns A unique slug
 */
export async function ensureUniqueSlug<T>(
  model: Model<T>,
  slug: string,
  excludeId?: string,
  tenantId?: string
): Promise<string> {
  // Create a regex to find similar slugs
  const slugRegex = createSlugRegex(slug);
  
  // Build the query
  const query: any = { slug: slugRegex };
  
  // Add tenant filter if provided
  if (tenantId) {
    query.tenantId = tenantId;
  }
  
  // Exclude the current document if ID provided
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  // Find documents with similar slugs
  const existingDocs = await model.find(query).select('slug').lean();
  
  // If no duplicates found, return the original slug
  if (existingDocs.length === 0) {
    return slug;
  }
  
  // Otherwise, add a numeric suffix
  return `${slug}-${existingDocs.length + 1}`;
}

/**
 * Generate a unique slug from a string
 * 
 * @param model Mongoose model
 * @param text Text to convert to slug
 * @param excludeId Optional ID to exclude from uniqueness check
 * @param tenantId Optional tenant ID for multi-tenant applications
 * @returns A unique slug
 */
export async function generateUniqueSlug<T>(
  model: Model<T>,
  text: string,
  excludeId?: string,
  tenantId?: string
): Promise<string> {
  // Generate the base slug
  const baseSlug = generateSlug(text);
  
  // Ensure it's unique
  return ensureUniqueSlug(model, baseSlug, excludeId, tenantId);
}

/**
 * Mongoose pre-save hook factory for automatic slug generation
 * 
 * @param options Configuration options
 * @returns A pre-save hook function
 */
export function createSlugPreSaveHook(options: {
  sourceField: string;
  slugField: string;
  tenantIdField?: string;
}) {
  const { sourceField, slugField, tenantIdField } = options;
  
  return async function(this: any, next: Function) {
    try {
      // Only generate slug if source field changed or slug doesn't exist
      if (this.isModified(sourceField) || !this.get(slugField)) {
        // Get the source text
        const sourceText = this.get(sourceField);
        
        // Generate base slug
        const baseSlug = generateSlug(sourceText);
        
        // Set the slug field
        this.set(slugField, baseSlug);
        
        // Check for uniqueness
        const tenantId = tenantIdField ? this.get(tenantIdField) : undefined;
        const uniqueSlug = await ensureUniqueSlug(
          this.constructor,
          baseSlug,
          this._id,
          tenantId
        );
        
        // Update with unique slug if different
        if (uniqueSlug !== baseSlug) {
          this.set(slugField, uniqueSlug);
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}