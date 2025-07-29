import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db';
import Tenant from './models/Tenant'; // Import Tenant
import User from './models/User'; // Import User
import ComprehensiveSeeder from './seeders/ComprehensiveSeeder';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Use the correct default Tenant ID to match the frontend configuration.
    const tenantId = process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303';
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'thomas.mcavoy@whitestartups.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AshenP3131m!';
    // The separate tenantSlug variable is no longer needed.

    // Data that can be updated on every run.
    const tenantUpdateData = {
      name: 'Whitestart System Security Inc.',
      domain: 'localhost',
      plan: 'enterprise',
      status: 'active',
      settings: { currency: 'USD', timezone: 'UTC', features: ['all'] },
      limits: { users: 999, products: 9999, storage: 102400 },
      isActive: true,
    };

    // Data that should only be set when the document is first created.
    const tenantOnInsertData = {
      _id: tenantId,
      // FIX: Use the tenantId for the slug as well for consistency.
      slug: tenantId,
    };

    const tenantResult = await Tenant.findOneAndUpdate(
      // FIX: The query condition now uses the tenantId for the slug lookup.
      { slug: tenantId },
      {
        $set: tenantUpdateData,
        $setOnInsert: tenantOnInsertData,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (tenantResult) {
      console.log('Default tenant ensured.');
    }

    // FIX: Correctly upsert the admin user to ensure password hashing is always triggered.
    let user = await User.findOne({ email: adminEmail, tenantId: tenantId });

    if (user) {
      // If user exists, update their details and password.
      // Setting the password directly triggers the 'pre-save' hook for hashing.
      console.log('Admin user found, ensuring all details are correct.');
      user.firstName = 'Thomas';
      user.lastName = 'McAvoy';
      user.role = 'admin';
      user.password = adminPassword;
      // FIX: Ensure phone, addresses, and preferences are also updated on subsequent runs.
      // user.phone = '555-123-4567'; // Property doesn't exist on User model
      user.addresses = [{
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'US',
        isPrimary: true
      }];
      user.preferences = {
        theme: 'light',
        notifications: {
          email: true,
          sms: false
        }
      };
      await user.save();
    } else {
      // If user does not exist, create them with a full set of attributes.
      console.log('Admin user not found, creating new user.');
      await User.create({
        firstName: 'Thomas',
        lastName: 'McAvoy',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        tenantId: tenantId,
        // phone: '555-123-4567', // Property doesn't exist on User model
        addresses: [{
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          country: 'US',
          isPrimary: true
        }],
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            sms: false
          }
        }
      });
    }
    
    console.log('Default admin user ensured.');

    console.log('Data seeding process complete!');
    process.exit();
  } catch (error) {
    console.error(`Seeding failed: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Tenant.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}