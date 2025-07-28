import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Explicitly import all models at the very top.
import Tenant from '../src/models/Tenant';
import User from '../src/models/User';

// Load environment variables
dotenv.config({ path: './.env' });

const inspectUsers = async () => {
  try {
    // Connect to the database directly within the script.
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in your .env file.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('💾 MongoDB Connected: localhost');
    
    console.log('🏢 Checking User collection...');

    // FIX: Use a more robust two-query approach to bypass the .populate() race condition.
    
    // 1. Fetch all users without populating.
    const users = await User.find({});

    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    // 2. Get all unique tenant IDs from the users.
    const tenantIds = [...new Set(users.map(user => user.tenantId).filter(id => id))];

    // 3. Fetch all corresponding tenants.
    const tenants = await Tenant.find({ _id: { $in: tenantIds } });

    // 4. Create a Map for fast, easy lookup.
    const tenantMap = new Map(tenants.map(t => [t._id.toString(), t]));

    console.log(`Found ${users.length} user(s):\n`);

    // 5. Display the users, manually "populating" the tenant info from the Map.
    users.forEach((user, index) => {
      const tenant = user.tenantId ? tenantMap.get(user.tenantId.toString()) : null;
      
      console.log(`--- User ${index + 1} ---`);
      console.log(`  ID:         ${user._id}`);
      console.log(`  Tenant:     ${tenant?.name || 'N/A'} (ID: ${tenant?._id || 'N/A'})`);
      console.log(`  Name:       ${user.name}`);
      console.log(`  Email:      ${user.email}`);
      console.log(`  Role:       ${user.role}`);
      console.log(`  Phone:      ${user.phone || 'N/A'}`);
      
      // FIX: Display full address details instead of just the count.
      if (user.addresses && user.addresses.length > 0) {
        console.log('  Addresses:');
        user.addresses.forEach((addr, i) => {
          console.log(`    - Address ${i + 1} (${addr.type}) ${addr.isDefault ? '[Default]' : ''}:`);
          console.log(`        ${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`);
        });
      } else {
        console.log('  Addresses:  0');
      }

      // FIX: Display the full preferences object.
      if (user.preferences) {
        console.log('  Preferences:');
        console.log(`    - Newsletter:    ${user.preferences.newsletter}`);
        console.log(`    - Notifications: ${user.preferences.notifications}`);
        console.log(`    - Language:      ${user.preferences.language}`);
      } else {
        console.log('  Preferences: N/A');
      }

      console.log(`  Created:    ${user.createdAt.toISOString()}`);
      console.log('----------------\n');
    });

  } catch (error) {
    console.error('❌ Error during user inspection:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Execute the function to inspect users.
inspectUsers();