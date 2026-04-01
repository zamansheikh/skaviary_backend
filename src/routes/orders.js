import { Router } from 'express';
import Order from '../models/Order.js';
import CartItem from '../models/CartItem.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// Get orders (user gets own, admin gets all)
router.get('/', authenticate, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, total, shipping_address } = req.body;
    const order = await Order.create({ user: req.user.id, items, total, shipping_address });
    // Clear cart after order
    await CartItem.deleteMany({ user: req.user.id });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status (admin)
router.put('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
