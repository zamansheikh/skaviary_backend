import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shipping_address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    district: String,
    zip: String,
  },
  payment: {
    method: { type: String, default: 'bkash' },
    bkash_number: String,
    transaction_id: String,
    amount: Number,
    verified: { type: Boolean, default: false },
  },
  notes: String,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
