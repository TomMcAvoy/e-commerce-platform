const dropshippingService = require('../__mocks__/services/dropshipping/DropshippingService');

test('hello world mock!', () => {
    const instance = dropshippingService.DropshippingService.getInstance();
    expect(instance).toBeDefined();
});