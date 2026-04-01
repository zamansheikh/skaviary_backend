import { Router } from 'express';
import Review from '../models/Review.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user.id, product: product_id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }

    const review = await Review.create({ user: req.user.id, product: product_id, rating, comment });
    const populated = await review.populate('user', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
