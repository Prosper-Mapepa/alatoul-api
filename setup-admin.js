/**
 * Setup script to generate JWT secret and create admin account
 * 
 * Usage:
 *   node setup-admin.js
 */

const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Generated JWT Secret:');
console.log('='.repeat(80));
console.log(jwtSecret);
console.log('='.repeat(80));
console.log('\n📝 Add this to your .env file as JWT_SECRET\n');

// Default admin credentials
const adminEmail = 'admin@alatoul.com';
const adminPassword = 'Admin@123456';
const adminName = 'Admin User';
const adminPhone = '+1234567890';

console.log('👤 Creating admin account...');
console.log(`   Email: ${adminEmail}`);
console.log(`   Password: ${adminPassword}`);
console.log(`   Name: ${adminName}`);
console.log('\n');

try {
  // Run the create-admin script
  execSync(
    `npx ts-node create-admin.ts "${adminEmail}" "${adminPassword}" "${adminName}" "${adminPhone}"`,
    { 
      stdio: 'inherit',
      cwd: __dirname 
    }
  );
  
  console.log('\n✅ Setup complete!');
  console.log('\n📋 Summary:');
  console.log(`   JWT Secret: ${jwtSecret.substring(0, 20)}...`);
  console.log(`   Admin Email: ${adminEmail}`);
  console.log(`   Admin Password: ${adminPassword}`);
  console.log('\n⚠️  IMPORTANT: Save the JWT secret above to your .env file!');
  
} catch (error) {
  console.error('\n❌ Error creating admin account:', error.message);
  console.log('\n💡 Make sure:');
  console.log('   1. Database is running and accessible');
  console.log('   2. .env file has correct database credentials');
  console.log('   3. Dependencies are installed (npm install)');
  process.exit(1);
}

