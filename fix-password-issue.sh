#!/bin/bash
echo "🔧 Fixing Password Issue"
echo "======================="

# Connect to MongoDB and reset password
mongosh shoppingcart --eval "
const bcrypt = require('bcryptjs');
const newPassword = 'AshenP3131m!';
const salt = bcrypt.genSaltSync(12);
const hashedPassword = bcrypt.hashSync(newPassword, salt);

db.users.updateOne(
  { email: 'thomas.mcavoy@whitestartups.com' },
  { \$set: { password: hashedPassword } }
);

console.log('✅ Password updated for thomas.mcavoy@whitestartups.com');
console.log('🔑 New password: AshenP3131m!');
"

echo "✅ Password reset complete"
