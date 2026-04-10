import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import BirdWiki from '../models/BirdWiki.js';
import Coupon from '../models/Coupon.js';
import Subscriber from '../models/Subscriber.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalWiki, totalCoupons, totalSubscribers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      BirdWiki.countDocuments(),
      Coupon.countDocuments(),
      Subscriber.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalProducts, totalOrders, totalUsers, totalWiki,
        totalCoupons, totalSubscribers,
        totalRevenue, recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
