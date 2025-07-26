interface IDropshippingProvider {
    createOrder(order: any): Promise<any>;
    getOrderStatus(orderId: string): Promise<any>;
    cancelOrder(orderId: string): Promise<any>;
    getAvailableProducts(): Promise<any>;
    isEnabled: boolean;
}