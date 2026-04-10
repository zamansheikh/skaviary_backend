import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, trim: true },
  name: { type: String, default: '' },
  source: { type: String, default: 'website' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Subscriber', subscriberSchema);
