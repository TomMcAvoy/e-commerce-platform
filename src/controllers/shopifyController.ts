import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ShopifyService } from '../services/shopify/ShopifyService';
import { dropshippingService } from '../services/dropshipping/DropshippingService';

// @desc    Sync dropship product to Shopify
// @route   POST /api/shopify/sync
// @access  Private/Admin
export const syncToShopify = asyncHandler(async (req: Request, res: Response) => {
  const { productId, provider } = req.body;
  
  const shopify = new ShopifyService(
    process.env.SHOPIFY_DOMAIN!,
    process.env.SHOPIFY_ACCESS_TOKEN!
  );

  const dsProducts = await dropshippingService.getProducts(provider, { id: productId });
  const shopifyProduct = await shopify.syncDropshipProduct(dsProducts[0]);

  res.status(200).json({
    success: true,
    data: {
      shopifyId: shopifyProduct.id,
      buyButtonData: {
        productId: shopifyProduct.id,
        variantId: shopifyProduct.variants[0].id,
        domain: process.env.SHOPIFY_DOMAIN,
        accessToken: process.env.SHOPIFY_STOREFRONT_TOKEN
      }
    }
  });
});

// @desc    Handle Shopify webhook for order fulfillment
// @route   POST /api/shopify/webhook
// @access  Public
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const order = req.body;
  
  const shopify = new ShopifyService(
    process.env.SHOPIFY_DOMAIN!,
    process.env.SHOPIFY_ACCESS_TOKEN!
  );

  const { dsersItems, shippingAddress } = await shopify.fulfillOrder(order);
  
  if (dsersItems.length > 0) {
    const fulfillmentResult = await dropshippingService.createOrder('dsers', {
      items: dsersItems,
      shippingAddress,
      orderId: order.id
    });
    console.log('DSers fulfillment:', fulfillmentResult);
  }

  res.status(200).json({ success: true });
});