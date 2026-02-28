import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const createFirstManager = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const existingManager = await User.findOne({ role: 'manager' });

    if (existingManager) {
      console.log('⚠️  A manager already exists:', existingManager.email);
      console.log('No need to create a first manager.');
      process.exit(0);
    }

    const email = process.env.FIRST_MANAGER_EMAIL || 'admin@example.com';
    const password = process.env.FIRST_MANAGER_PASSWORD || 'admin123';

    const manager = await User.create({
      email,
      password,
      role: 'manager',
    });

    console.log('🎉 First manager created successfully!');
    console.log('Email:', manager.email);
    console.log('Password:', password);
    console.log('\n⚠️  IMPORTANT: Please change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating first manager:', error);
    process.exit(1);
  }
};

createFirstManager();
