import request from 'supertest';
import app from '../../test-app-setup';
describe('Toys & Games Category API Tests', () => {
  describe('GET /api/products/category/toys-games', () => {
    it('should return toys and games products', async () => {
      const response = await request(app)
        .get('/api/products/category/toys-games')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by age group', async () => {
      const response = await request(app)
        .get('/api/products/category/toys-games?ageGroup=6-12')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.ageRange).toContain('6-12');
      });
    });

    it('should check safety certifications', async () => {
      const response = await request(app)
        .get('/api/products/category/toys-games?safetyTested=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.safetyCertifications).toContain('CPSC');
      });
    });
  });
});
