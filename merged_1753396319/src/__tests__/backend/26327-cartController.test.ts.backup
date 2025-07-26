import request from 'supertest';
import app from '../../index';
import { CartService } from '../../services/cartService';
import { ICartItem } from '../../types/cart';

describe('Cart Controller', () => {
  describe('addToCart', () => {
    it('should add item to empty cart', () => {
      const cart: ICartItem[] = [];
      const item: ICartItem = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
        quantity: 1
      };

      const result = CartService.addToCart(cart, item);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(item);
    });

    it('should update quantity for existing item', () => {
      const existingItem: ICartItem = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
        quantity: 1
      };
      const cart: ICartItem[] = [existingItem];
      
      const newItem: ICartItem = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
        quantity: 2
      };

      const result = CartService.addToCart(cart, newItem);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(3); // 1 + 2
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const item: ICartItem = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
        quantity: 1
      };
      const cart: ICartItem[] = [item];

      const result = CartService.removeFromCart(cart, '123');

      expect(result).toHaveLength(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate cart total correctly', () => {
      const cart: ICartItem[] = [
        { productId: '1', name: 'Item 1', price: 10.00, quantity: 2 },
        { productId: '2', name: 'Item 2', price: 15.00, quantity: 1 }
      ];

      const total = CartService.calculateCartTotal(cart);

      expect(total).toBe(35.00); // (10 * 2) + (15 * 1)
    });
  });
});
