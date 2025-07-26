'use client';

import { useState } from 'react';
// Assuming your models can be imported. Adjust path if needed.
// You might need to create a shared types package or duplicate interfaces on the frontend.
// import { IProduct } from '../../../../src/models/Product';

// For now, we'll define a local type to avoid import issues.
type ProductFormData = {
  name?: string;
  sku?: string;
  price?: { current: number; original?: number; currency: string; };
  variants?: { type: 'color' | 'size' | 'style'; options: any[] };
  b2b?: { minOrderQuantity: number; priceTiers: any[]; productType: 'ready_to_ship' | 'customizable'; leadTime: string; supplyAbility: string; };
};

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: { current: 0, original: 0, currency: 'USD' },
    variants: { type: 'color', options: [] },
    b2b: { minOrderQuantity: 1, priceTiers: [], productType: 'ready_to_ship', leadTime: '', supplyAbility: '' }
  });

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newOptions = [...(formData.variants?.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, variants: { ...formData.variants, options: newOptions } });
  };

  const addVariantOption = () => {
    const newOptions = [...(formData.variants?.options || []), { name: '', sku_suffix: '', inventory: 0 }];
    setFormData({ ...formData, variants: { ...formData.variants, options: newOptions } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call your API function from lib/api.ts
    console.log('Submitting form data:', formData);
    // e.g., createProduct(formData, token);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold">Product Form</h2>
      
      {/* Basic Info */}
      <div className="space-y-2">
        <div>
          <label className="block">Product Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 rounded bg-gray-700"/>
        </div>
        <div>
          <label className="block">SKU</label>
          <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full p-2 rounded bg-gray-700"/>
        </div>
        <div>
          <label className="block">Price</label>
          <input type="number" value={formData.price?.current} onChange={(e) => setFormData({ ...formData, price: { ...formData.price, current: parseFloat(e.target.value) } })} className="w-full p-2 rounded bg-gray-700"/>
        </div>
      </div>

      {/* Variants Section */}
      <div className="p-4 border border-gray-600 rounded">
        <h3 className="font-semibold">Variants</h3>
        {formData.variants?.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input placeholder="Name (e.g., Red)" value={option.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} className="flex-1 p-2 rounded bg-gray-700"/>
            <input placeholder="SKU Suffix" value={option.sku_suffix} onChange={(e) => handleVariantChange(index, 'sku_suffix', e.target.value)} className="p-2 rounded bg-gray-700"/>
            <input type="number" placeholder="Inventory" value={option.inventory} onChange={(e) => handleVariantChange(index, 'inventory', parseInt(e.target.value))} className="w-24 p-2 rounded bg-gray-700"/>
          </div>
        ))}
        <button type="button" onClick={addVariantOption} className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Add Variant</button>
      </div>

      <button type="submit" className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold">Save Product</button>
    </form>
  );
}
