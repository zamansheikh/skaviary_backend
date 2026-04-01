import { Router } from 'express';
import BirdWiki from '../models/BirdWiki.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { createSlug } from '../utils/helpers.js';

const router = Router();

// Get all wiki entries
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientific_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [entries, total] = await Promise.all([
      BirdWiki.find(filter).populate('category', 'name slug').sort({ name: 1 }).skip(skip).limit(Number(limit)),
      BirdWiki.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: entries,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single wiki entry by slug
router.get('/:slug', async (req, res) => {
  try {
    const entry = await BirdWiki.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!entry) return res.status(404).json({ success: false, message: 'Bird not found' });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create wiki entry (admin)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const slug = createSlug(req.body.name);
    const entry = await BirdWiki.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update wiki entry (admin)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    if (req.body.name) req.body.slug = createSlug(req.body.name);
    const entry = await BirdWiki.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Bird not found' });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete wiki entry (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await BirdWiki.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Wiki entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
