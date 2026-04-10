import { Router } from 'express';
import Product from '../models/Product.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { createSlug } from '../utils/helpers.js';

const router = Router();

// Get all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ is_featured: true }).populate('category', 'name slug').limit(8);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single product by slug or ID
router.get('/:slugOrId', async (req, res) => {
  try {
    const param = req.params.slugOrId;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(param);
    const product = isObjectId
      ? await Product.findById(param).populate('category', 'name slug')
      : await Product.findOne({ slug: param }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create product (admin)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const slug = createSlug(req.body.name);
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update product (admin)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    if (req.body.name) {
      const existing = await Product.findById(req.params.id);
      if (existing && existing.name !== req.body.name) {
        req.body.slug = createSlug(req.body.name);
      } else {
        delete req.body.slug;
      }
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete product (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
