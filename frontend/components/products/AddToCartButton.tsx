'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { IProduct } from '../../../src/models/Product'; // Using backend type for consistency

interface AddToCartButtonProps {
  product: IProduct;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addItem(product, quantity);
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        min="1"
        style={{ width: '60px', padding: '0.5rem', textAlign: 'center' }}
      />
      <button 
        onClick={handleAddToCart}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;