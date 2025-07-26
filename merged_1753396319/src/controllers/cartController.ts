
import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product, { IProductVariant } from '../models/Product';
import { AuthenticatedRequest, OptionalAuthRequest, ApiResponse } from '../types';
import AppError from '../utils/AppError';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private/Public (supports both authenticated users and guest sessions)
export const getCart = async (
  req: OptionalAuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    let cart;
    
    if (req.user) {
      // Authenticated user
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId', 'name images');
    } else {
      // Guest user - check for session ID in headers or query
      const sessionId = req.headers['x-session-id'] as string || req.query.sessionId as string;
      if (!sessionId) {
        // If no session, return a default empty cart structure immediately
        res.status(200).json({ success: true, data: { items: [], subtotal: 0, itemCount: 0 } });
        return;
      }
      cart = await Cart.findOne({ sessionId }).populate('items.productId', 'name images');
    }

    if (!cart) {
      // Return empty cart if none exists for the user/session
      const emptyCart = {
        items: [],
        subtotal: 0,
        itemCount: 0
      };
      
      res.status(200).json({
        success: true,
        data: emptyCart
      });
      return;
    }

    // Calculate item count
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        ...cart.toJSON(),
        itemCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private/Public
export const addToCart = async (
  req: OptionalAuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }

    if (quantity < 1) {
      return next(new AppError('Quantity must be at least 1', 400));
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if product is archived
    if (product.isArchived) {
      return next(new AppError('Product is not available', 400));
    }

    // Verify variant if provided
    let variant: IProductVariant | undefined = undefined;
    if (variantId) {
      // Add explicit type for 'v' to resolve implicit 'any' error
      variant = product.variants.find((v: IProductVariant) => v._id?.toString() === variantId);
      if (!variant) {
        return next(new AppError('Product variant not found', 404));
      }
    }

    // Get or create cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [] });
      }
    } else {
      const sessionId = req.headers['x-session-id'] as string || req.body.sessionId;
      if (!sessionId) {
        return next(new AppError('Session ID required for guest cart', 400));
      }
      cart = await Cart.findOne({ sessionId });
      if (!cart) {
        cart = new Cart({ sessionId, items: [] });
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && 
               (!variantId || item.variantId?.toString() === variantId)
    );

    const price = variant ? variant.price : product.price;
    const name = variant ? `${product.name} - ${variant.value}` : product.name;
    const sku = variant ? variant.sku : product.sku;
    const image = product.images?.[0]; // Use main product image

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        variantId,
        quantity,
        price,
        name,
        image,
        sku
      });
    }

    await cart.save();

    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        ...cart.toJSON(),
        itemCount
      },
      message: 'Item added to cart'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private/Public
export const updateCartItem = async (
  req: OptionalAuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (typeof quantity !== 'number' || quantity < 0) {
      return next(new AppError('Valid quantity is required', 400));
    }

    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        return next(new AppError('Session ID required for guest cart', 400));
      }
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    // Find and update item
    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    if (itemIndex === -1) {
      return next(new AppError('Cart item not found', 404));
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        ...cart.toJSON(),
        itemCount
      },
      message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private/Public
export const removeFromCart = async (
  req: OptionalAuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;

    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        return next(new AppError('Session ID required for guest cart', 400));
      }
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    // Find and remove item
    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    if (itemIndex === -1) {
      return next(new AppError('Cart item not found', 404));
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        ...cart.toJSON(),
        itemCount
      },
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private/Public
export const clearCart = async (
  req: OptionalAuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        return next(new AppError('Session ID required for guest cart', 400));
      }
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      // If no cart, nothing to clear. Send success.
      res.status(200).json({ success: true, message: 'Cart is already empty' });
      return;
    }

    // Correct way to clear a Mongoose DocumentArray
    cart.items.splice(0, cart.items.length);
    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        ...cart.toJSON(),
        itemCount: 0
      },
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart with user cart on login
// @route   POST /api/cart/merge
// @access  Private
export const mergeCart = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { guestSessionId } = req.body;

    if (!guestSessionId) {
      return next(new AppError('Guest session ID is required', 400));
    }

    // Get guest cart
    const guestCart = await Cart.findOne({ sessionId: guestSessionId });
    if (!guestCart || guestCart.items.length === 0) {
      // If no guest cart or it's empty, just return the user's current cart
      const userCart = await Cart.findOne({ userId: req.user._id });
      res.status(200).json({
        success: true,
        data: userCart,
        message: 'No guest cart to merge'
      });
      return;
    }

    // Get or create user cart
    let userCart = await Cart.findOne({ userId: req.user._id });
    if (!userCart) {
      userCart = new Cart({ userId: req.user._id, items: [] });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        item => item.productId.toString() === guestItem.productId.toString() && 
                 item.variantId?.toString() === guestItem.variantId?.toString()
      );

      if (existingItemIndex >= 0) {
        // Add quantities if item exists
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();

    // Delete guest cart
    await Cart.deleteOne({ _id: guestCart._id });

    const itemCount = userCart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        ...userCart.toJSON(),
        itemCount
      },
      message: 'Cart merged successfully'
    });
  } catch (error) {
    next(error);
  }
};