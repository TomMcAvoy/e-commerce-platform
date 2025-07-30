import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Cart, { ICartItem } from '../models/Cart';
import Product from '../models/Product';
import AppError from '../utils/AppError';
// import { AuthenticatedRequest } from '../types/auth';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product');

    if (!cart) {
        // Return an empty cart structure if none exists
        res.status(200).json({
            success: true,
            data: { items: [], subTotal: 0 }
        });
    } else {
        res.status(200).json({
            success: true,
            data: cart
        });
    }
});


// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;
    const userId = req.user!._id;

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
        // Cart exists, update it
        const itemIndex = cart.items.findIndex((p: ICartItem) => p.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Product not in cart, add new item
            cart.items.push({ product: productId, name: product.name, price: product.price, quantity });
        }
    } else {
        // No cart for user, create new cart
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, name: product.name, price: product.price, quantity }]
        });
    }
    
    await cart.populate('items.product');
    res.status(200).json({ success: true, data: cart });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
export const updateItemQuantity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user!._id;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return next(new AppError('Quantity must be a positive number', 400));
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex((p: ICartItem) => p.product.toString() === productId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.product');
        res.status(200).json({ success: true, data: cart });
    } else {
        return next(new AppError('Item not found in cart', 404));
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const userId = req.user!._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex((p: ICartItem) => p.product.toString() === productId);

    if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate('items.product');
    } else {
        return next(new AppError('Item not found in cart', 404));
    }

    res.status(200).json({ success: true, data: cart });
});

// @desc    Clear all items from cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;

    const cart = await Cart.findOne({ user: userId });

    if (cart) {
        cart.items = [];
        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } else {
        // If no cart exists, send a success response with an empty cart structure
        res.status(200).json({ success: true, data: { items: [], subTotal: 0 } });
    }
});