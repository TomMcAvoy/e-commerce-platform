import { DropshippingService } from './DropshippingService';

describe('DropshippingService', () => {
	test('should create a new order', () => {
		const orderData = { item: 'Product1', quantity: 2 };
		const result = DropshippingService.createOrder(orderData);
		expect(result).toEqual(expect.objectContaining(orderData));
	});

	test('should fetch order details', () => {
		const orderId = '12345';
		const result = DropshippingService.getOrderDetails(orderId);
		expect(result).toHaveProperty('id', orderId);
	});

	test('should cancel an order', () => {
		const orderId = '12345';
		const result = DropshippingService.cancelOrder(orderId);
		expect(result).toBe(true);
	});
});