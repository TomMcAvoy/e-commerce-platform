const DropshippingService = {
    getInstance: jest.fn(() => ({
        createOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getOrderStatus: jest.fn(),
        isProviderEnabled: jest.fn(),
        getEnabledProviders: jest.fn(),
        getDefaultProvider: jest.fn(),
        getProviderHealth: jest.fn(),
        getAllProducts: jest.fn(),
    })),
};

export { DropshippingService };