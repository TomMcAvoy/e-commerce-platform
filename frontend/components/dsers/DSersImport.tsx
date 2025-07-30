'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function DSersImport() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const syncToShopify = async (productId: string) => {
    try {
      await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, provider: 'dsers' })
      });
      alert('Product synced to Shopify!');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dsers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, limit: 20 })
      });
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Import failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">DSers AliExpress Import</h2>
      
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={handleImport} disabled={loading}>
          {loading ? 'Importing...' : 'Import Products'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-green-600">${product.price}</p>
            <p className="text-sm text-gray-600">Supplier: {product.supplier}</p>
            <Button 
              className="mt-2" 
              onClick={() => syncToShopify(product.id)}
            >
              Add Buy Button
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}