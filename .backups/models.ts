interface IDropshippingProvider {
    isEnabled: boolean;
    getProducts(query: any): Promise<any[]>;
    getProduct(productId: string): Promise<any>;
}