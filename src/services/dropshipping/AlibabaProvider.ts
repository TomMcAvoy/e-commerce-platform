import { IDropshippingProvider, ProductSearchParams, DropshipProduct, OrderCreationResult, DropshipOrderData, InventoryUpdate, ShippingInfo } from './types';
import AppError from '../../utils/AppError';

interface AlibabaConfig {
  apiKey: string;
  appSecret: string;
  accessToken?: string;
}

export class AlibabaProvider implements IDropshippingProvider {
  private config: AlibabaConfig;
  private baseUrl = 'https://gw.open.1688.com/openapi';

  constructor(config: AlibabaConfig) {
    this.config = config;
  }

  getProviderName(): string {
    return 'Alibaba';
  }

  async checkHealth(): Promise<{ status: string; details: any }> {
    try {
      // Test API connectivity
      const response = await this.makeRequest('/param2/1/system/currentTime');
      return {
        status: 'healthy',
        details: { timestamp: response.currentTime, provider: 'Alibaba' }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: (error as Error).message, provider: 'Alibaba' }
      };
    }
  }

  async fetchProducts(params: ProductSearchParams): Promise<DropshipProduct[]> {
    try {
      const searchParams = {
        keywords: params.keyword || '',
        categoryId: this.getCategoryId(params.category),
        pageIndex: params.page || 1,
        pageSize: params.limit || 20,
        orderBy: 'gmv_desc' // Order by sales volume
      };

      const response = await this.makeRequest('/param2/1/cn.alibaba.open/offer.search', searchParams);
      
      return response.result?.offers?.map((offer: any) => ({
        id: offer.offerId.toString(),
        name: offer.subject,
        description: offer.details || offer.subject,
        price: this.parsePrice(offer.saledProductInfos?.[0]?.price),
        imageUrl: offer.image?.images?.[0] || '',
        variants: this.parseVariants(offer.saledProductInfos),
        vendor: offer.sellerUserId || 'alibaba-vendor',
        category: params.category || 'general',
        sku: offer.offerId.toString(),
        stock: offer.saledProductInfos?.[0]?.inventory || 0,
        minOrderQuantity: offer.saledProductInfos?.[0]?.minOrderQuantity || 1,
        supplierInfo: {
          companyName: offer.sellerLoginId,
          location: offer.sellerAddress
        }
      })) || [];
    } catch (error) {
      console.error('Error fetching Alibaba products:', error);
      return [];
    }
  }

  async createOrder(orderData: DropshipOrderData): Promise<OrderCreationResult> {
    try {
      const orderParams = {
        addressParam: {
          address: orderData.shippingAddress.address1,
          fullName: orderData.customerInfo.name,
          mobile: orderData.customerInfo.phone,
          phone: orderData.customerInfo.phone,
          postCode: orderData.shippingAddress.zip,
          provinceText: orderData.shippingAddress.state,
          cityText: orderData.shippingAddress.city,
          districtText: orderData.shippingAddress.city
        },
        cargoParamList: orderData.items.map(item => ({
          offerId: item.externalVariantId,
          specId: item.externalVariantId,
          quantity: item.quantity
        })),
        message: orderData.notes || 'Dropship order'
      };

      const response = await this.makeRequest('/param2/1/cn.alibaba.open/trade.order.createOrder', orderParams);
      
      return {
        orderId: response.orderId?.toString() || Date.now().toString(),
        externalOrderId: response.orderId?.toString() || Date.now().toString(),
        status: 'pending',
        providerData: response
      };
    } catch (error) {
      throw new AppError(`Alibaba order creation failed: ${error.message}`, 400);
    }
  }

  async updateInventory(updates: InventoryUpdate[]): Promise<void> {
    // Alibaba doesn't support direct inventory updates for dropshipping
    console.log('Alibaba inventory updates not supported for dropshipping');
  }

  async calculateShipping(orderData: DropshipOrderData): Promise<ShippingInfo> {
    try {
      const shippingParams = {
        addressParam: {
          provinceText: orderData.shippingAddress.state,
          cityText: orderData.shippingAddress.city
        },
        cargoParamList: orderData.items.map(item => ({
          offerId: item.externalVariantId,
          quantity: item.quantity
        }))
      };

      const response = await this.makeRequest('/param2/1/cn.alibaba.open/trade.order.getLogisticsInfo', shippingParams);
      
      return {
        cost: response.freight || 0,
        estimatedDelivery: this.calculateDeliveryDate(response.deliveryTime || 15)
      };
    } catch (error) {
      return {
        cost: 0,
        estimatedDelivery: this.calculateDeliveryDate(15)
      };
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/param2/1/cn.alibaba.open/category.get');
      
      return response.categoryInfos?.map((cat: any) => ({
        id: cat.categoryId,
        name: cat.categoryName,
        slug: this.createSlug(cat.categoryName),
        parentId: cat.parentId,
        level: cat.level,
        hasChildren: cat.isLeaf === false,
        productCount: 0 // Will be updated when products are imported
      })) || [];
    } catch (error) {
      console.error('Error fetching Alibaba categories:', error);
      return this.getDefaultCategories();
    }
  }

  private async makeRequest(endpoint: string, params: any = {}): Promise<any> {
    const timestamp = Date.now();
    const signature = this.generateSignature(endpoint, params, timestamp);
    
    const url = `${this.baseUrl}${endpoint}`;
    const requestParams = {
      ...params,
      access_token: this.config.accessToken,
      _aop_timestamp: timestamp,
      _aop_signature: signature
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestParams)
    });

    if (!response.ok) {
      throw new AppError(`Alibaba API error: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new AppError(`Alibaba API error: ${data.error_message}`, 400);
    }

    return data;
  }

  private generateSignature(endpoint: string, params: any, timestamp: number): string {
    // Simplified signature generation - in production, use proper HMAC-SHA1
    const sortedParams = Object.keys(params).sort().map(key => `${key}${params[key]}`).join('');
    return Buffer.from(`${endpoint}${sortedParams}${timestamp}${this.config.appSecret}`).toString('base64');
  }

  private parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    const match = priceStr.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  private parseVariants(saledProductInfos: any[]): any[] {
    if (!saledProductInfos) return [];
    
    return saledProductInfos.map(info => ({
      id: info.specId,
      price: this.parsePrice(info.price),
      inventory: info.inventory || 0,
      attributes: info.specAttrs || []
    }));
  }

  private getCategoryId(category?: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': '509',
      'fashion': '1420',
      'home': '1503',
      'beauty': '1501',
      'sports': '200001395',
      'automotive': '43',
      'jewelry': '1509'
    };
    
    return categoryMap[category || ''] || '';
  }

  private createSlug(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private calculateDeliveryDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private getDefaultCategories(): any[] {
    return [
      { id: '509', name: 'Electronics & Electrical', slug: 'electronics-electrical', level: 1 },
      { id: '1420', name: 'Apparel & Fashion', slug: 'apparel-fashion', level: 1 },
      { id: '1503', name: 'Home & Garden', slug: 'home-garden', level: 1 },
      { id: '1501', name: 'Beauty & Personal Care', slug: 'beauty-personal-care', level: 1 },
      { id: '200001395', name: 'Sports & Entertainment', slug: 'sports-entertainment', level: 1 },
      { id: '43', name: 'Automobiles & Motorcycles', slug: 'automobiles-motorcycles', level: 1 },
      { id: '1509', name: 'Jewelry & Accessories', slug: 'jewelry-accessories', level: 1 }
    ];
  }
}