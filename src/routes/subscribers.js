import { Router } from 'express';
import Subscriber from '../models/Subscriber.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// Get all subscribers (admin)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Subscribe (public)
router.post('/', async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'ফোন নম্বর দিন' });

    const existing = await Subscriber.findOne({ phone });
    if (existing) return res.json({ success: true, message: 'ইতিমধ্যে যুক্ত আছেন', data: existing });

    const subscriber = await Subscriber.create({ phone, name: name || '' });
    res.status(201).json({ success: true, data: subscriber, message: 'ধন্যবাদ! আমরা আপনার সাথে যোগাযোগ করব।' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete subscriber (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
