import { productController } from '../controllers/productController';

describe('productController', () => {
	test('should create a product', () => {
		const product = { name: 'Test Product', price: 100 };
		const result = productController.createProduct(product);
		expect(result).toEqual(expect.objectContaining(product));
	});

	test('should get a product by id', () => {
		const productId = 1;
		const result = productController.getProductById(productId);
		expect(result).toHaveProperty('id', productId);
	});

	test('should update a product', () => {
		const productId = 1;
		const updatedProduct = { name: 'Updated Product', price: 150 };
		const result = productController.updateProduct(productId, updatedProduct);
		expect(result).toEqual(expect.objectContaining(updatedProduct));
	});

	test('should delete a product', () => {
		const productId = 1;
		const result = productController.deleteProduct(productId);
		expect(result).toBe(true);
	});
});