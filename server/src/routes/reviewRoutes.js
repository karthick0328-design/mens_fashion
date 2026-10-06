import { Router } from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, addReview);

export default router;
