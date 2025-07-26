import { ICartItem, ICart } from '../types/cart';
import { AppError } from '../utils/AppError';

/**
 * CartService following copilot service layer architecture pattern
 * Provides business logic for shopping cart operations
 */
export class CartService {
  static addToCart(cart: ICartItem[], item: ICartItem): ICartItem[] {
    // Validate cart item following error handling pattern
    this.validateCartItem(item);

    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.productId === item.productId && 
      JSON.stringify(cartItem.variant) === JSON.stringify(item.variant)
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.push(item);
    }

    return cart;
  }

  static removeFromCart(cart: ICartItem[], productId: string, variant?: any): ICartItem[] {
    return cart.filter(
      item => !(item.productId === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant))
    );
  }

  static async getCartItems(userId: string): Promise<ICart> {
    if (!userId) {
      throw new AppError('User ID is required for cart operations', 400);
    }

    // Implementation following authentication pattern
    return {
      userId,
      items: [],
      total: 0,
      updatedAt: new Date()
    };
  }

  static calculateCartTotal(items: ICartItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  static validateCartItem(item: ICartItem): void {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      throw new AppError('Invalid cart item: productId and positive quantity required', 400);
    }

    if (!item.name || !item.price || item.price <= 0) {
      throw new AppError('Invalid cart item: name and valid price required', 400);
    }
  }
}

// Export individual functions for backward compatibility
export const addToCart = CartService.addToCart;
export const removeFromCart = CartService.removeFromCart;
export const getCartItems = CartService.getCartItems;
