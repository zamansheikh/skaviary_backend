import { Router } from 'express';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Upload single image
router.post('/', authenticate, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url, filename: req.file.filename } });
});

// Upload multiple images
router.post('/multiple', authenticate, adminOnly, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const urls = req.files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.filename }));
  res.json({ success: true, data: urls });
});

export default router;
