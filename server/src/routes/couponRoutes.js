import { Router } from 'express';
import { validateCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/validate', protect, validateCoupon);

export default router;
