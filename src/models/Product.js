import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  discount_price: { type: Number, default: null },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [{ type: String }],
  features: [{ type: String }],
  is_featured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
