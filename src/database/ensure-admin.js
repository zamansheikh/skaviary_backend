import User from '../models/User.js';

export async function ensureAdmin() {
  try {
    const admin = await User.findOne({ email: 'admin@skaviary.com' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@skaviary.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Admin account created (admin@skaviary.com / admin123)');
    } else {
      console.log('👤 Admin account exists');
    }
  } catch (err) {
    console.error('Failed to ensure admin:', err.message);
  }
}
