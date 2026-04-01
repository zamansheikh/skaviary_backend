import mongoose from 'mongoose';

const birdWikiSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  scientific_name: { type: String, default: '' },
  description: { type: String, default: '' },
  habitat: { type: String, default: '' },
  diet: { type: String, default: '' },
  lifespan: { type: String, default: '' },
  conservation_status: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  fun_facts: [{ type: String }],
}, { timestamps: true });

birdWikiSchema.index({ name: 'text', description: 'text', scientific_name: 'text' });

export default mongoose.model('BirdWiki', birdWikiSchema);
