import { authController } from '../controllers/authController';

describe('authController', () => {
	test('should register a user', async () => {
		const response = await authController.register({ username: 'test', password: 'test' });
		expect(response).toHaveProperty('success', true);
	});

	test('should login a user', async () => {
		const response = await authController.login({ username: 'test', password: 'test' });
		expect(response).toHaveProperty('success', true);
	});

	test('should fail to login with wrong credentials', async () => {
		const response = await authController.login({ username: 'wrong', password: 'wrong' });
		expect(response).toHaveProperty('success', false);
	});
});