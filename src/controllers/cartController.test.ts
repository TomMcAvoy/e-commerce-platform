import { addToCart, removeFromCart, getCartItems } from '../services/cartService';

describe('cartController', () => {
	test('addToCart adds an item to the cart', () => {
		const initialCart = [];
		const item = { id: 1, name: 'Test Item' };
		const updatedCart = addToCart(initialCart, item);
		expect(updatedCart).toEqual([item]);
	});

	test('removeFromCart removes an item from the cart', () => {
		const initialCart = [{ id: 1, name: 'Test Item' }];
		const updatedCart = removeFromCart(initialCart, 1);
		expect(updatedCart).toEqual([]);
	});

	test('getCartItems returns the current items in the cart', () => {
		const cart = [{ id: 1, name: 'Test Item' }];
		const items = getCartItems(cart);
		expect(items).toEqual(cart);
	});
});