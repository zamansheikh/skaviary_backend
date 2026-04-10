import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true, min: 0 },
  min_order: { type: Number, default: 0 },
  max_discount: { type: Number, default: null },
  usage_limit: { type: Number, default: null },
  used_count: { type: Number, default: 0 },
  per_user_limit: { type: Number, default: 1 },
  used_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  is_active: { type: Boolean, default: true },
  expires_at: { type: Date, default: null },
  description: { type: String, default: '' },
}, { timestamps: true });

couponSchema.methods.isValid = function (userId, orderTotal) {
  if (!this.is_active) return { valid: false, message: 'কুপন নিষ্ক্রিয়' };
  if (this.expires_at && new Date() > this.expires_at) return { valid: false, message: 'কুপনের মেয়াদ শেষ' };
  if (this.usage_limit && this.used_count >= this.usage_limit) return { valid: false, message: 'কুপন ব্যবহারের সীমা শেষ' };
  if (orderTotal < this.min_order) return { valid: false, message: `সর্বনিম্ন ৳${this.min_order} অর্ডার করতে হবে` };
  if (userId) {
    const userUsage = this.used_by.filter(id => id.toString() === userId.toString()).length;
    if (userUsage >= this.per_user_limit) return { valid: false, message: 'আপনি ইতিমধ্যে এই কুপন ব্যবহার করেছেন' };
  }
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderTotal, costTotal) {
  let discount = 0;
  if (this.type === 'percentage') {
    discount = Math.round(orderTotal * (this.value / 100));
  } else {
    discount = this.value;
  }
  if (this.max_discount && discount > this.max_discount) {
    discount = this.max_discount;
  }
  if (discount > orderTotal) discount = orderTotal;

  const finalPrice = orderTotal - discount;
  const profit = finalPrice - costTotal;

  return { discount, finalPrice, profit };
};

export default mongoose.model('Coupon', couponSchema);
