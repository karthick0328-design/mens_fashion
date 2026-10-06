import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // Cart is synced with authenticated user account

router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items/:sku', updateQuantity);
router.delete('/items/:sku', removeFromCart);
router.delete('/clear', clearCart);

export default router;
