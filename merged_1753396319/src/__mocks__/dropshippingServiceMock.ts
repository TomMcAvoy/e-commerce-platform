const DropshippingService = {
	getInstance: jest.fn(() => ({
		createOrder: jest.fn().mockResolvedValue({ orderId: 'mock-order-123', success: true }),
		getEnabledProviders: jest.fn().mockReturnValue([]),
		getDefaultProvider: jest.fn().mockReturnValue(null),
		getProviderHealth: jest.fn().mockResolvedValue([]),
		getAllProducts: jest.fn().mockResolvedValue([]),
	}),
};

export default DropshippingService;