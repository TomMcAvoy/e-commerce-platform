const { generateToken } = require('../../utils/token');
const User = require('../../models/User');
const Product = require('../../models/Product');

describe('Cart Controller', () => {
    let user;
    let product1;
    let product2;

    beforeEach(async () => {
        user = await User.create({ /* user data */ });
        product1 = await Product.create({ /* product1 data */ });
        product2 = await Product.create({ /* product2 data */ });
    });

    test('should generate token for user', () => {
        const token = generateToken(user._id);
        expect(token).toBeDefined();
    });

    test('should add product to cart', async () => {
        const response = await request(app)
            .post('/api/cart')
            .send({ productId: product1._id, quantity: 2 });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });

    test('should retrieve cart items', async () => {
        await request(app).post('/api/cart').send({ productId: product1._id, quantity: 1 });
        const response = await request(app).get('/api/cart');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
    });
});