import axios from 'axios';

export class ShopifyService {
  private domain: string;
  private accessToken: string;

  constructor(domain: string, accessToken: string) {
    this.domain = domain;
    this.accessToken = accessToken;
  }

  async createProduct(productData: any) {
    const response = await axios.post(
      `https://${this.domain}/admin/api/2023-10/products.json`,
      { product: productData },
      { headers: { 'X-Shopify-Access-Token': this.accessToken } }
    );
    return response.data.product;
  }

  async syncDropshipProduct(dsProduct: any) {
    const shopifyProduct = {
      title: dsProduct.title,
      body_html: dsProduct.description,
      vendor: dsProduct.supplier,
      product_type: dsProduct.category,
      variants: [{
        price: dsProduct.price,
        inventory_management: null,
        inventory_policy: 'continue',
        sku: `dsers-${dsProduct.id}`
      }],
      images: dsProduct.images?.map((img: string) => ({ src: img })) || [],
      metafields: [{
        namespace: 'dsers',
        key: 'product_id',
        value: dsProduct.id,
        type: 'single_line_text_field'
      }]
    };

    return this.createProduct(shopifyProduct);
  }

  async fulfillOrder(orderData: any) {
    // Extract DSers product IDs from Shopify order
    const dsersItems = orderData.line_items
      .filter((item: any) => item.sku?.startsWith('dsers-'))
      .map((item: any) => ({
        productId: item.sku.replace('dsers-', ''),
        quantity: item.quantity,
        variantId: item.variant_id
      }));

    return { dsersItems, shippingAddress: orderData.shipping_address };
  }
}