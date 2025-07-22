import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      paymentStatus,
      sort = '-createdAt',
      limit = '10',
      page = '1'
    } = req.query;

    // Build query
    const query: any = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Parse pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort(sort as string)
      .limit(limitNum)
      .skip(skip)
      .populate('vendorOrders.items.productId', 'name images')
      .lean();

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ 
      _id: id, 
      userId: req.user._id 
    }).populate('vendorOrders.items.productId', 'name images sku');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes
    } = req.body;

    // Validate required fields
    if (!paymentMethod) {
      return next(new AppError('Payment method is required', 400));
    }

    if (!shippingAddress) {
      return next(new AppError('Shipping address is required', 400));
    }

    if (!billingAddress) {
      return next(new AppError('Billing address is required', 400));
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    // Validate cart items and check availability
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new AppError(`Product ${item.name} no longer exists`, 400));
      }

      if (!product.isActive) {
        return next(new AppError(`Product ${item.name} is no longer available`, 400));
      }

      // Check inventory if tracking is enabled
      if (product.inventory?.trackQuantity) {
        if (product.inventory.quantity < item.quantity) {
          return next(new AppError(`Insufficient stock for ${item.name}`, 400));
        }
      }
    }

    // Group items by vendor
    const vendorGroups: { [vendorId: string]: any[] } = {};
    
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      const vendorId = product?.vendorId || 'platform';
      
      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = [];
      }
      
      vendorGroups[vendorId].push({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image: item.image
      });
    }

    // Create vendor orders
    const vendorOrders = Object.keys(vendorGroups).map(vendorId => {
      const items = vendorGroups[vendorId];
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08; // 8% tax rate - should be configurable
      const shipping = 10; // Flat shipping rate - should be calculated
      
      return {
        vendorId,
        items,
        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping,
        status: 'pending'
      };
    });

    // Calculate order totals
    const subtotal = vendorOrders.reduce((sum, vo) => sum + vo.subtotal, 0);
    const tax = vendorOrders.reduce((sum, vo) => sum + vo.tax, 0);
    const shipping = vendorOrders.reduce((sum, vo) => sum + vo.shipping, 0);
    const total = subtotal + tax + shipping;

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      vendorOrders,
      subtotal,
      tax,
      shipping,
      discount: 0,
      total,
      currency: 'USD',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes,
      trackingNumbers: []
    });

    // Update product inventory
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product?.inventory?.trackQuantity) {
        product.inventory.quantity -= item.quantity;
        await product.save();
      }
    }

    // Clear the cart
    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin/Vendor only)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Vendor)
export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, vendorId, trackingNumber } = req.body;

    if (!status) {
      return next(new AppError('Status is required', 400));
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isVendor = req.user.role === 'vendor';
    
    if (!isAdmin && !isVendor) {
      return next(new AppError('Not authorized to update order status', 403));
    }

    // If vendor, they can only update their own vendor orders
    if (isVendor && !isAdmin) {
      if (!vendorId) {
        return next(new AppError('Vendor ID is required', 400));
      }

      const vendorOrder = order.vendorOrders.find(vo => vo.vendorId === vendorId);
      if (!vendorOrder) {
        return next(new AppError('Vendor order not found', 404));
      }

      // Update vendor order status
      vendorOrder.status = status;
      if (trackingNumber) {
        vendorOrder.trackingNumber = trackingNumber;
        if (!order.trackingNumbers.includes(trackingNumber)) {
          order.trackingNumbers.push(trackingNumber);
        }
      }

      // Update overall order status based on vendor order statuses
      const allStatuses = order.vendorOrders.map(vo => vo.status);
      if (allStatuses.every(s => s === 'delivered')) {
        order.status = 'delivered';
      } else if (allStatuses.some(s => s === 'shipped')) {
        order.status = 'shipped';
      } else if (allStatuses.some(s => s === 'processing')) {
        order.status = 'processing';
      }
    } else {
      // Admin can update overall order status
      order.status = status;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Find order
    const order = await Order.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Check if order can be cancelled
    if (order.status === 'shipped' || order.status === 'delivered') {
      return next(new AppError('Cannot cancel order that has been shipped or delivered', 400));
    }

    if (order.status === 'cancelled') {
      return next(new AppError('Order is already cancelled', 400));
    }

    // Update order status
    order.status = 'cancelled';
    if (reason) {
      order.notes = order.notes ? `${order.notes}\n\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`;
    }

    // Restore inventory
    for (const vendorOrder of order.vendorOrders) {
      for (const item of vendorOrder.items) {
        const product = await Product.findById(item.productId);
        if (product?.inventory?.trackQuantity) {
          product.inventory.quantity += item.quantity;
          await product.save();
        }
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};
