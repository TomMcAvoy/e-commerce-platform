const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = {
      tenantId: '6884bf4702e02fe6eb401303',
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'customer'
    };
    
    await User.deleteOne({ email: 'test@example.com' });
    await User.create(testUser);
    console.log('Created test user: test@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();