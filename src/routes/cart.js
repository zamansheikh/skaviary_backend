import { Router } from 'express';
import CartItem from '../models/CartItem.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get cart items
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await CartItem.find({ user: req.user.id }).populate('product');
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    let item = await CartItem.findOne({ user: req.user.id, product: product_id });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ user: req.user.id, product: product_id, quantity });
    }

    item = await item.populate('product');
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update cart item quantity
router.put('/:id', authenticate, async (req, res) => {
  try {
    const item = await CartItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { quantity: req.body.quantity },
      { new: true }
    ).populate('product');
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove from cart
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await CartItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
