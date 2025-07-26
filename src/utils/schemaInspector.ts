import mongoose from 'mongoose';
import Product from '../models/Product';
import Vendor from '../models/Vendor';
import Category from '../models/Category';
import User from '../models/User';
import Tenant from '../models/Tenant';

/**
 * Schema Inspector following Copilot Instructions
 * Identifies required fields for seeding
 */
export class SchemaInspector {
  static inspectModel(model: mongoose.Model<any>): any {
    const schema = model.schema;
    const requiredFields: string[] = [];
    const optionalFields: string[] = [];
    
    schema.eachPath((pathname, schematype) => {
      if (schematype.isRequired) {
        requiredFields.push(pathname);
      } else {
        optionalFields.push(pathname);
      }
    });
    
    return {
      modelName: model.modelName,
      requiredFields,
      optionalFields,
      example: this.generateExample(schema)
    };
  }
  
  static generateExample(schema: mongoose.Schema): any {
    const example: any = {};
    
    schema.eachPath((pathname, schematype) => {
      if (schematype.isRequired && pathname !== '_id' && pathname !== '__v') {
        example[pathname] = this.getExampleValue(schematype);
      }
    });
    
    return example;
  }
  
  static getExampleValue(schematype: any): any {
    const typeName = schematype.constructor.name;
    
    switch (typeName) {
      case 'SchemaString': return 'example-string';
      case 'SchemaNumber': return 123;
      case 'SchemaBoolean': return true;
      case 'SchemaDate': return new Date();
      case 'ObjectId': return new mongoose.Types.ObjectId();
      case 'SchemaArray': return [];
      default: return 'unknown-type';
    }
  }
  
  static async inspectAllModels(): Promise<void> {
    console.log('🔍 Schema Inspector - Required Fields Analysis');
    console.log('=============================================');
    
    const models = [Product, Vendor, Category, User, Tenant];
    
    for (const model of models) {
      const inspection = this.inspectModel(model);
      console.log(`\n📋 ${inspection.modelName} Model:`);
      console.log(`✅ Required: ${inspection.requiredFields.join(', ')}`);
      console.log(`⚪ Optional: ${inspection.optionalFields.slice(0, 5).join(', ')}...`);
      console.log(`📝 Example:`, JSON.stringify(inspection.example, null, 2));
    }
  }
}