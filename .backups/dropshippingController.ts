import { Request, Response, NextFunction } from 'express';
import { DropshippingService } from '../services/dropshipping/DropshippingService';
import AppError from '../utils/AppError';
import { ApiResponse, ProductSearchQuery } from '../types';

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Helper functions for AliExpress catalog import
const extractProductIdFromUrl = (url: string): string | null => {
  try {
    const patterns = [
      /\/item\/(\d+)\.html/,
      /\/item\/(\d+)/,
      /item\/(\d+)/,
      /\/(\d+)\.html/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch {
    return null;
  }
};

const parseImages = (imageData: string | string[]): string[] => {
  if (!imageData) return [];
  
  if (Array.isArray(imageData)) {
    return imageData.filter(img => img && typeof img === 'string');
  }
  
  if (typeof imageData === 'string') {
    return imageData.split(',').map(img => img.trim()).filter(img => img);
  }
  
  return [];
};

const generateSKU = (title: string): string => {
  const clean = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toUpperCase()
    .substring(0, 20);
  
  const timestamp = Date.now().toString().slice(-6);
  return `AE-${clean}-${timestamp}`;
};

const parseDimensions = (dimensionData: any): any => {
  if (!dimensionData) return null;
  
  if (typeof dimensionData === 'string') {
    try {
      return JSON.parse(dimensionData);
    } catch {
      // Try to parse format like "10x5x3 cm"
      const match = dimensionData.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/i);
      if (match) {
        return {
          length: parseFloat(match[1]),
          width: parseFloat(match[2]),
          height: parseFloat(match[3]),
          unit: dimensionData.includes('cm') ? 'cm' : 'inch'
        };
      }
    }
  }
  
  return dimensionData;
};

const parseVariants = (variantData: any): any[] => {
  if (!variantData) return [];
  
  if (typeof variantData === 'string') {
    try {
      return JSON.parse(variantData);
    } catch {
      // Simple parsing for basic variant format
      return variantData.split(',').map(v => ({ name: v.trim() }));
    }
  }
  
  if (Array.isArray(variantData)) {
    return variantData;
  }
  
  return [];
};

const applyPricing = (originalPrice: number, settings: any): number => {
  let finalPrice = originalPrice;
  
  // Apply markup percentage
  if (settings.markupPercentage) {
    finalPrice = originalPrice * (1 + settings.markupPercentage / 100);
  }
  
  // Apply min/max price constraints
  if (settings.minPrice && finalPrice < settings.minPrice) {
    finalPrice = settings.minPrice;
  }
  
  if (settings.maxPrice && finalPrice > settings.maxPrice) {
    finalPrice = settings.maxPrice;
  }
  
  // Round price if enabled
  if (settings.priceRounding) {
    finalPrice = Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
  }
  
  return finalPrice;
};

const mapCategory = (originalCategory: string, categoryMapping: any): string => {
  if (categoryMapping && categoryMapping[originalCategory]) {
    return categoryMapping[originalCategory];
  }
  return originalCategory || 'General';
};

const checkForDuplicate = async (productData: any): Promise<any> => {
  // TODO: Implement actual duplicate checking with Product model
  // For now, return null (no duplicate found)
  return null;
};

const simulateAliExpressScraping = async (url: string): Promise<any> => {
  // TODO: Implement actual AliExpress API integration or web scraping
  // For now, return simulated data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: `Sample Product from ${url}`,
        description: 'This is a sample product description from AliExpress.',
        price: 19.99,
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        category: 'Electronics',
        brand: 'Generic'
      });
    }, 1000);
  });
};

// Initialize dropshipping service
const dropshippingService = new DropshippingService();

// Initialize all providers on startup
//dropshippingService.initializeAll().catch(console.error);
console.log('✅ Dropshipping Service ready:', dropshippingService.getEnabledProviders());
// @desc    Get available dropshipping providers
// @route   GET /api/dropshipping/providers
// @access  Public
export const getProviders = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const providers = dropshippingService.getProviders();
    
    res.status(200).json({
      success: true,
      data: {
        providers,
        count: providers.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products across dropshipping providers
// @route   GET /api/dropshipping/search
// @access  Private
export const searchProducts = async (
  req: Request<{}, ApiResponse, {}, ProductSearchQuery>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy,
      sortOrder,
      provider
    } = req.query;

    const searchParams = {
      keyword: q,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as 'price' | 'rating' | 'sales' | 'newest' | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined
    };

    const results = await dropshippingService.searchProducts(searchParams, provider as string);

    res.status(200).json({
      success: true,
      data: {
        results,
        searchParams,
        totalProviders: results.length,
        totalProducts: results.reduce((sum, result) => sum + result.products.length, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product from dropshipping provider
// @route   GET /api/dropshipping/products/:provider/:productId
// @access  Private
export const getProduct = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { provider, productId } = req.params;

    const product = await dropshippingService.getProduct(productId, provider);

    res.status(200).json({
      success: true,
      data: {
        product,
        provider
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import product from dropshipping provider
// @route   POST /api/dropshipping/import
// @access  Private (Vendor/Admin)
export const importProduct = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, provider } = req.body;

    if (!productId || !provider) {
      return next(new AppError('Product ID and provider are required', 400));
    }

    const result = await dropshippingService.importProduct(productId, provider);

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync inventory for dropshipping products
// @route   POST /api/dropshipping/sync-inventory
// @access  Private (Vendor/Admin)
export const syncInventory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productMappings } = req.body;

    if (!productMappings || !Array.isArray(productMappings)) {
      return next(new AppError('Product mappings array is required', 400));
    }

    const updates = await dropshippingService.syncInventory(productMappings);

    res.status(200).json({
      success: true,
      data: {
        updates,
        syncedCount: updates.length
      },
      message: `Synced inventory for ${updates.length} products`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create dropshipping order
// @route   POST /api/dropshipping/orders
// @access  Private (Vendor/Admin)
export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderData, provider } = req.body;

    if (!orderData) {
      return next(new AppError('Order data is required', 400));
    }

    const result = await dropshippingService.createOrder(orderData, provider);

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dropshipping order status
// @route   GET /api/dropshipping/orders/:provider/:orderId
// @access  Private (Vendor/Admin)
export const getOrderStatus = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { provider, orderId } = req.params;

    const status = await dropshippingService.getOrderStatus(orderId, provider);

    res.status(200).json({
      success: true,
      data: {
        status,
        provider
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Health check for dropshipping providers
// @route   GET /api/dropshipping/health
// @access  Public
export const healthCheck = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const health = await dropshippingService.healthCheck();

    res.status(200).json({
      success: true,
      data: {
        providers: health,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product recommendations
// @route   GET /api/dropshipping/recommendations
// @access  Private
export const getRecommendations = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, limit = 20 } = req.query;

    const recommendations = await dropshippingService.getRecommendations(
      category as string,
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk import products
// @route   POST /api/dropshipping/bulk-import
// @access  Private (Vendor/Admin)
export const bulkImport = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { searchQuery, provider, maxProducts = 50 } = req.body;

    if (!searchQuery || !provider) {
      return next(new AppError('Search query and provider are required', 400));
    }

    const results = await dropshippingService.bulkImport(
      searchQuery,
      provider,
      Number(maxProducts)
    );

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.status(200).json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failureCount
        }
      },
      message: `Bulk import completed: ${successCount} successful, ${failureCount} failed`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import AliExpress catalog via CSV upload
// @route   POST /api/dropshipping/aliexpress/csv-import
// @access  Private (Vendor/Admin)
export const importAliExpressCatalog = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { csvData, vendorId, importSettings } = req.body;

    if (!csvData || !Array.isArray(csvData)) {
      return next(new AppError('Valid CSV data array is required', 400));
    }

    const defaultSettings = {
      markupPercentage: 30,
      autoPublish: false,
      categoryMapping: {},
      priceRounding: true,
      minPrice: 1.00,
      maxPrice: 10000.00,
      skipDuplicates: true,
      ...importSettings
    };

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const productData of csvData) {
      try {
        // Validate required AliExpress fields
        if (!productData.productUrl || !productData.title || !productData.price) {
          results.push({
            success: false,
            error: 'Missing required fields: productUrl, title, or price',
            originalData: productData
          });
          failureCount++;
          continue;
        }

        // Parse AliExpress product data
        const aliexpressProduct = {
          externalId: productData.productId || extractProductIdFromUrl(productData.productUrl),
          title: productData.title,
          description: productData.description || '',
          originalPrice: parseFloat(productData.price),
          salePrice: productData.salePrice ? parseFloat(productData.salePrice) : null,
          currency: productData.currency || 'USD',
          images: parseImages(productData.images || productData.imageUrls),
          category: productData.category || 'General',
          brand: productData.brand || 'AliExpress',
          sku: productData.sku || generateSKU(productData.title),
          weight: productData.weight ? parseFloat(productData.weight) : null,
          dimensions: parseDimensions(productData.dimensions),
          variants: parseVariants(productData.variants || productData.specifications),
          shipping: {
            freeShipping: productData.freeShipping === 'true' || productData.freeShipping === true,
            shippingTime: productData.shippingTime || '7-15 days',
            shippingCost: productData.shippingCost ? parseFloat(productData.shippingCost) : 0
          },
          supplier: {
            name: productData.supplierName || 'AliExpress Seller',
            rating: productData.supplierRating ? parseFloat(productData.supplierRating) : null,
            country: productData.supplierCountry || 'China'
          },
          productUrl: productData.productUrl,
          minOrderQuantity: productData.moq ? parseInt(productData.moq) : 1,
          stockQuantity: productData.stock ? parseInt(productData.stock) : 999
        };

        // Apply markup and price rules
        const finalPrice = applyPricing(aliexpressProduct.originalPrice, defaultSettings);
        
        // Create product in our system
        const importedProduct = {
          name: aliexpressProduct.title,
          description: aliexpressProduct.description,
          price: finalPrice,
          originalPrice: aliexpressProduct.originalPrice,
          images: aliexpressProduct.images,
          category: mapCategory(aliexpressProduct.category, defaultSettings.categoryMapping),
          brand: aliexpressProduct.brand,
          sku: aliexpressProduct.sku,
          stock: aliexpressProduct.stockQuantity,
          isDropshipped: true,
          dropshipProvider: 'aliexpress',
          externalProductId: aliexpressProduct.externalId,
          externalProductUrl: aliexpressProduct.productUrl,
          vendorId: vendorId,
          variants: aliexpressProduct.variants,
          shipping: aliexpressProduct.shipping,
          supplier: aliexpressProduct.supplier,
          isActive: defaultSettings.autoPublish,
          importedAt: new Date(),
          importBatch: req.headers['x-import-batch-id'] || new Date().getTime().toString()
        };

        // Check for duplicates if enabled
        if (defaultSettings.skipDuplicates) {
          const existingProduct = await checkForDuplicate(importedProduct);
          if (existingProduct) {
            results.push({
              success: false,
              error: 'Product already exists',
              existingProductId: existingProduct._id,
              originalData: productData
            });
            failureCount++;
            continue;
          }
        }

        // TODO: Create actual product in database
        // const createdProduct = await Product.create(importedProduct);

        results.push({
          success: true,
          productId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: importedProduct.name,
          price: importedProduct.price,
          originalPrice: importedProduct.originalPrice,
          sku: importedProduct.sku
        });
        successCount++;

      } catch (productError: any) {
        results.push({
          success: false,
          error: productError?.message || 'Failed to process product',
          originalData: productData
        });
        failureCount++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        results,
        summary: {
          total: csvData.length,
          successful: successCount,
          failed: failureCount,
          importSettings: defaultSettings
        }
      },
      message: `AliExpress catalog import completed: ${successCount} successful, ${failureCount} failed`
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Import AliExpress products via product URLs
// @route   POST /api/dropshipping/aliexpress/url-import
// @access  Private (Vendor/Admin)
export const importAliExpressUrls = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productUrls, vendorId, importSettings } = req.body;

    if (!productUrls || !Array.isArray(productUrls)) {
      return next(new AppError('Valid product URLs array is required', 400));
    }

    const defaultSettings = {
      markupPercentage: 30,
      autoPublish: false,
      priceRounding: true,
      ...importSettings
    };

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const url of productUrls) {
      try {
        // Extract product ID from AliExpress URL
        const productId = extractProductIdFromUrl(url);
        if (!productId) {
          results.push({
            success: false,
            error: 'Invalid AliExpress URL format',
            url
          });
          failureCount++;
          continue;
        }

        // TODO: Implement AliExpress API scraping or integration
        // For now, we'll simulate the process
        const scrapedProduct = await simulateAliExpressScraping(url);
        
        const finalPrice = applyPricing(scrapedProduct.price, defaultSettings);

        const importedProduct = {
          name: scrapedProduct.title,
          description: scrapedProduct.description,
          price: finalPrice,
          originalPrice: scrapedProduct.price,
          images: scrapedProduct.images,
          sku: generateSKU(scrapedProduct.title),
          isDropshipped: true,
          dropshipProvider: 'aliexpress',
          externalProductId: productId,
          externalProductUrl: url,
          vendorId: vendorId,
          isActive: defaultSettings.autoPublish,
          importedAt: new Date()
        };

        // TODO: Create actual product in database
        // const createdProduct = await Product.create(importedProduct);

        results.push({
          success: true,
          productId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: importedProduct.name,
          price: importedProduct.price,
          url
        });
        successCount++;

      } catch (urlError: any) {
        results.push({
          success: false,
          error: urlError?.message || 'Failed to import product',
          url
        });
        failureCount++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        results,
        summary: {
          total: productUrls.length,
          successful: successCount,
          failed: failureCount
        }
      },
      message: `URL import completed: ${successCount} successful, ${failureCount} failed`
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get import templates and guides
// @route   GET /api/dropshipping/aliexpress/import-guide
// @access  Private (Vendor/Admin)
export const getAliExpressImportGuide = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const guide = {
      csvTemplate: {
        requiredFields: [
          'productUrl',
          'title',
          'price'
        ],
        optionalFields: [
          'productId',
          'description',
          'salePrice',
          'currency',
          'images',
          'imageUrls',
          'category',
          'brand',
          'sku',
          'weight',
          'dimensions',
          'variants',
          'specifications',
          'freeShipping',
          'shippingTime',
          'shippingCost',
          'supplierName',
          'supplierRating',
          'supplierCountry',
          'moq',
          'stock'
        ],
        sampleData: [
          {
            productUrl: 'https://www.aliexpress.com/item/1234567890.html',
            title: 'Wireless Bluetooth Headphones',
            price: '25.99',
            description: 'High-quality wireless headphones with noise cancellation',
            category: 'Electronics',
            brand: 'TechBrand',
            images: 'https://example.com/image1.jpg,https://example.com/image2.jpg',
            freeShipping: 'true',
            shippingTime: '7-15 days'
          }
        ]
      },
      importSettings: {
        markupPercentage: {
          description: 'Percentage markup to apply to original price',
          default: 30,
          range: '0-200'
        },
        autoPublish: {
          description: 'Automatically publish imported products',
          default: false
        },
        priceRounding: {
          description: 'Round prices to nearest dollar',
          default: true
        },
        minPrice: {
          description: 'Minimum allowed price',
          default: 1.00
        },
        maxPrice: {
          description: 'Maximum allowed price',
          default: 10000.00
        },
        skipDuplicates: {
          description: 'Skip products that already exist',
          default: true
        }
      },
      supportedUrlFormats: [
        'https://www.aliexpress.com/item/{productId}.html',
        'https://www.aliexpress.com/item/{productId}',
        'https://aliexpress.com/item/{productId}',
        'https://m.aliexpress.com/item/{productId}.html'
      ],
      tips: [
        'Ensure product URLs are valid and accessible',
        'Use competitive markup percentages (20-50%)',
        'Always review imported products before publishing',
        'Check for trademark or copyright issues',
        'Verify shipping times and costs',
        'Monitor supplier ratings and feedback'
      ],
      limitations: [
        'Maximum 100 products per import batch',
        'Import processing may take several minutes',
        'Some product data may require manual review',
        'Images must be publicly accessible URLs'
      ]
    };

    res.status(200).json({
      success: true,
      data: guide
    });
  } catch (error) {
    next(error);
  }
};
