/**
 * Script to create an admin user on Railway
 * 
 * This script connects to Railway's PostgreSQL database and creates an admin account.
 * 
 * Usage:
 *   1. Get your Railway database credentials from Railway dashboard
 *   2. Set environment variables or pass them as arguments:
 *      npx ts-node create-admin-railway.ts
 * 
 * Or with explicit credentials:
 *   DB_HOST=your-host DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=your-password DB_DATABASE=railway npx ts-node create-admin-railway.ts
 * 
 * Default admin credentials:
 *   Email: admin@alatoul.com
 *   Password: Admin@123456
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, AccountStatus } from './src/entities/user.entity';
import { Ride } from './src/entities/ride.entity';
import { Payment } from './src/entities/payment.entity';
import { KYC } from './src/entities/kyc.entity';
import { Vehicle } from './src/entities/vehicle.entity';
import { Message } from './src/entities/message.entity';
import { Rating } from './src/entities/rating.entity';

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}

async function createAdminOnRailway() {
  // Default admin credentials
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@alatoul.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.ADMIN_NAME || 'Admin User';
  const adminPhone = process.env.ADMIN_PHONE || '+1234567890';

  console.log('🚂 Creating admin account on Railway...\n');
  console.log('📋 Admin Credentials:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Name: ${adminName}\n`);

  // Check for DATABASE_URL first (Railway's preferred method)
  let dataSourceConfig: any;

  if (process.env.DATABASE_URL) {
    console.log('✅ Using DATABASE_URL from environment...');
    dataSourceConfig = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating],
      synchronize: false,
      logging: false,
      ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
    };
  } else {
    // Fall back to individual database variables
    const dbHost = process.env.DB_HOST || process.env.PGHOST;
    const dbPort = parseInt(process.env.DB_PORT || process.env.PGPORT || '5432');
    const dbUsername = process.env.DB_USERNAME || process.env.PGUSER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || process.env.PGPASSWORD;
    const dbDatabase = process.env.DB_DATABASE || process.env.PGDATABASE;

    if (!dbHost || !dbPassword || !dbDatabase) {
      console.error('❌ Error: Database credentials not found!');
      console.error('\nPlease provide one of the following:');
      console.error('  1. DATABASE_URL environment variable (Railway provides this)');
      console.error('  2. Or set: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE');
      console.error('\n💡 To get Railway database credentials:');
      console.error('  1. Go to your Railway project dashboard');
      console.error('  2. Click on your PostgreSQL service');
      console.error('  3. Go to the "Variables" tab');
      console.error('  4. Copy the DATABASE_URL or individual connection variables');
      process.exit(1);
    }

    console.log('✅ Using individual database variables...');
    dataSourceConfig = {
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbDatabase,
      entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating],
      synchronize: false,
      logging: false,
      ssl: dbHost.includes('railway') ? { rejectUnauthorized: false } : false,
    };
  }

  const dataSource = new DataSource(dataSourceConfig);

  try {
    console.log('🔌 Connecting to Railway database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully!\n');

    const userRepository = dataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingUser) {
      if (existingUser.role !== UserRole.ADMIN) {
        console.log('⚠️  User exists but is not an admin. Updating to admin...');
        existingUser.role = UserRole.ADMIN;
        existingUser.status = AccountStatus.ACTIVE;
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        existingUser.password = hashedPassword;
        await userRepository.save(existingUser);
        console.log('✅ User updated to admin successfully!\n');
      } else {
        console.log('ℹ️  Admin user already exists. Updating password...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        existingUser.password = hashedPassword;
        existingUser.status = AccountStatus.ACTIVE;
        await userRepository.save(existingUser);
        console.log('✅ Admin password updated!\n');
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const adminUser = userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        phone: adminPhone,
        role: UserRole.ADMIN,
        status: AccountStatus.ACTIVE,
        isEmailVerified: true,
      });

      await userRepository.save(adminUser);
      console.log('✅ Admin user created successfully!\n');
    }

    console.log('📋 Final Admin Credentials:');
    console.log('='.repeat(50));
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Name: ${adminName}`);
    console.log(`   Role: Admin`);
    console.log(`   Status: Active`);
    console.log('='.repeat(50));
    console.log('\n🎉 You can now login with these credentials at your Railway backend URL!');
    console.log('   Example: https://your-app.railway.app/api/auth/login\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check that your Railway database is running');
    console.error('   2. Verify DATABASE_URL or database credentials are correct');
    console.error('   3. Make sure migrations have been run');
    console.error('   4. Check Railway logs for database connection issues');
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

createAdminOnRailway();
