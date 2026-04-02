import { Router } from 'express';
import Category from '../models/Category.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { createSlug } from '../utils/helpers.js';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create category (admin)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const slug = createSlug(req.body.name);
    const category = await Category.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update category (admin)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    if (req.body.name) {
      const existing = await Category.findById(req.params.id);
      if (existing && existing.name !== req.body.name) {
        req.body.slug = createSlug(req.body.name);
      } else {
        delete req.body.slug;
      }
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete category (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
