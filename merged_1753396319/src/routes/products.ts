import { Router } from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  getProductsByCategory
} from '../controllers/productController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/category/:category/seasonal', getProductsByCategory);

export default router;
