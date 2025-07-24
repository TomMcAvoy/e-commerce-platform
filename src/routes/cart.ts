import { Router } from 'express';
import { 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  getCart, 
  clearCart 
} from '../controllers/cartController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth); // Allow both authenticated and guest users

router.route('/')
  .get(getCart);

router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;
