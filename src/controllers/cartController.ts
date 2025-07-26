import { Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import AppError from '../utils/AppError';
import { TenantRequest } from '../middleware/tenantResolver';

// Helper function to calculate totals and format cart response
const getCartResponse = async (cart: any) => {
    await cart.populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price stock images',
    });

    cart.calculateSubtotal();
    await cart.save();
    return cart;
};

// @desc    Get user's shopping cart
// @route   GET /api/cart
export const getCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id, tenantId: req.tenantId });

        if (!cart) {
            // If no cart, create one for the user
            cart = await Cart.create({ user: req.user.id, tenantId: req.tenantId, items: [] });
        }

        const cartResponse = await getCartResponse(cart);
        res.status(200).json({ success: true, data: cartResponse });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
export const addItemToCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
        return next(new AppError('Please provide a valid product ID and quantity', 400));
    }

    try {
        const product = await Product.findOne({ _id: productId, tenantId: req.tenantId });
        if (!product) {
            return next(new AppError('Product not found', 404));
        }
        if (product.stock < quantity) {
            return next(new AppError(`Not enough stock for ${product.name}`, 400));
        }

        const cart = await Cart.findOne({ user: req.user.id, tenantId: req.tenantId });
        if (!cart) {
            return next(new AppError('Cart not found, please access GET /api/cart first to initialize.', 404));
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity = quantity;
        } else {
            // Product does not exist in cart, add new item
            cart.items.push({ product: productId, quantity });
        }

        const cartResponse = await getCartResponse(cart);
        res.status(200).json({ success: true, data: cartResponse });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
export const removeItemFromCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.id, tenantId: req.tenantId });
        if (!cart) {
            return next(new AppError('Cart not found', 404));
        }

        cart.items = cart.items.filter(p => p.product.toString() !== productId);

        const cartResponse = await getCartResponse(cart);
        res.status(200).json({ success: true, data: cartResponse });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart
export const clearCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id, tenantId: req.tenantId });
        if (!cart) {
            return next(new AppError('Cart not found', 404));
        }

        cart.items = [];
        const cartResponse = await getCartResponse(cart);
        res.status(200).json({ success: true, data: cartResponse });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};