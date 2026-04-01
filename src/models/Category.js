import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  type: { type: String, enum: ['product', 'wiki'], default: 'product' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
