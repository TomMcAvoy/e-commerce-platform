class DropshippingService {
    static instance: DropshippingService;

    static getInstance() {
        if (!DropshippingService.instance) {
            DropshippingService.instance = new DropshippingService();
        }
        return DropshippingService.instance;
    }

    // Mock methods for testing
    createOrder(orderData: any) {
        return { success: true, orderId: 'mock-order-123', provider: 'mock-provider' };
    }

    getEnabledProviders() {
        return [{ name: 'Mock Provider', isEnabled: true }];
    }

    // Add other methods as needed
}