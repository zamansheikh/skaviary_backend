import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import BirdWiki from '../models/BirdWiki.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// Get dashboard stats
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalWiki, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      BirdWiki.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalWiki,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
