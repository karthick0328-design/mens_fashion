import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { USER_ROLES } from '../constants/index.js';

const updateAdmin = async () => {
  try {
    console.log('[UpdateAdmin] Connecting to MongoDB...');
    await connectDB();

    // Check if an existing admin with admin@aurelius.com exists or admin@example.com exists
    let admin = await User.findOne({
      $or: [
        { email: 'admin@example.com' },
        { email: 'admin@aurelius.com' },
        { role: USER_ROLES.SUPER_ADMIN },
        { role: USER_ROLES.ADMIN },
      ],
    });

    if (admin) {
      console.log(`[UpdateAdmin] Updating existing admin account (${admin.email})...`);
      admin.email = 'admin@example.com';
      admin.passwordHash = 'Admin@123'; // Triggers pre-save bcrypt hook
      admin.role = USER_ROLES.SUPER_ADMIN || USER_ROLES.ADMIN;
      await admin.save();
      console.log('[UpdateAdmin] Admin account updated successfully!');
    } else {
      console.log('[UpdateAdmin] Creating new admin account (admin@example.com)...');
      admin = new User({
        name: 'Aurelius Executive',
        email: 'admin@example.com',
        passwordHash: 'Admin@123',
        phone: '+91 98765 43210',
        role: USER_ROLES.SUPER_ADMIN || USER_ROLES.ADMIN,
        addresses: [
          {
            name: 'Aurelius Headquarters',
            phone: '+91 98765 43210',
            addressLine1: '402, High Street Phoenix',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400013',
            country: 'India',
            isDefault: true,
          },
        ],
      });
      await admin.save();
      console.log('[UpdateAdmin] New admin account created successfully!');
    }

    console.log('\n========================================');
    console.log('✅ ADMIN CREDENTIALS UPDATED:');
    console.log('Email:    admin@example.com');
    console.log('Password: Admin@123');
    console.log('Role:     ' + admin.role);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[UpdateAdmin Error]:', error);
    process.exit(1);
  }
};

updateAdmin();
