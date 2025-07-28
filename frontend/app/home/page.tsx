"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { Navigation } from "../../components/navigation/Navigation";
import { ProductCard } from "../../components/products/ProductCard";

// Define a type for the product for clarity
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

export default function HomePage() {
  // Correctly destructure state and dispatch from the cart context
  const { state, dispatch } = useCart();

  // Placeholder product data - in a real app, this would be fetched from an API
  const products: Product[] = [
    {
      _id: "prod_1",
      name: "High-Performance Router",
      price: 199.99,
      images: ["/placeholder.png"],
      slug: "performance-router",
    },
    {
      _id: "prod_2",
      name: "Secure VPN Gateway",
      price: 299.99,
      images: ["/placeholder.png"],
      slug: "secure-gateway",
    },
    {
      _id: "prod_3",
      name: "Network Security Camera",
      price: 149.99,
      images: ["/placeholder.png"],
      slug: "security-camera",
    },
    {
      _id: "prod_4",
      name: "Enterprise Firewall",
      price: 499.99,
      images: ["/placeholder.png"],
      slug: "enterprise-firewall",
    },
  ];

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity: 1 },
    });
    alert(`${product.name} has been added to your cart.`);
  };

  return (
    <div>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Whitestart System Security
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your trusted partner in network and system security solutions.
          </p>
        </div>

        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <ProductCard product={product} />
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
