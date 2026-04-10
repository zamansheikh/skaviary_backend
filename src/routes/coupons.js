import { Router } from 'express';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// Get all coupons (admin)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create coupon (admin)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update coupon (admin)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete coupon (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Apply coupon (user) — validate and calculate discount
router.post('/apply', authenticate, async (req, res) => {
  try {
    const { code, items } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'কুপন কোড সঠিক নয়' });

    // Calculate order total and cost total
    let orderTotal = 0;
    let costTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        const salePrice = product.discount_price || product.price;
        orderTotal += salePrice * item.quantity;
        costTotal += (product.cost_price || 0) * item.quantity;
      }
    }

    const validation = coupon.isValid(req.user.id, orderTotal);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { discount, finalPrice, profit } = coupon.calculateDiscount(orderTotal, costTotal);

    // Suggest minimum price for admin profit
    const suggestedMinOrder = costTotal > 0 ? Math.ceil(costTotal * 1.15) : 0;

    res.json({
      success: true,
      data: {
        coupon: { code: coupon.code, type: coupon.type, value: coupon.value, description: coupon.description },
        discount,
        orderTotal,
        finalPrice,
        costTotal,
        profit,
        suggestedMinOrder,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark coupon as used (called after order)
router.post('/use', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.json({ success: true });
    coupon.used_count += 1;
    coupon.used_by.push(req.user.id);
    await coupon.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Generate reward coupon after order (returns a new coupon for the user)
router.post('/reward', authenticate, async (req, res) => {
  try {
    // Check if user already has an unused reward coupon
    const existing = await Coupon.findOne({
      code: { $regex: `^REWARD-${req.user.id.slice(-6).toUpperCase()}` },
      used_count: 0,
      is_active: true,
    });
    if (existing) {
      return res.json({ success: true, data: existing });
    }

    const code = `REWARD-${req.user.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const coupon = await Coupon.create({
      code,
      type: 'percentage',
      value: 5,
      min_order: 500,
      max_discount: 200,
      usage_limit: 1,
      per_user_limit: 1,
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'অর্ডারের পুরস্কার! পরবর্তী অর্ডারে ৫% ছাড়',
    });
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
