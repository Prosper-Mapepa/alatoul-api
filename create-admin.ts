/**
 * Script to create an admin user
 * 
 * Usage:
 *   npx ts-node create-admin.ts <email> <password> <name> [phone]
 * 
 * Example:
 *   npx ts-node create-admin.ts admin@alatoul.com Admin123! "Admin User"
 * 
 * Make sure to set your database environment variables in .env file
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

// Try to load dotenv if available (optional)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: npx ts-node create-admin.ts <email> <password> <name> [phone]');
    console.error('Example: npx ts-node create-admin.ts admin@alatoul.com Admin123! "Admin User"');
    process.exit(1);
  }

  const [email, password, name, phone] = args;

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long');
    process.exit(1);
  }

  // Initialize database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'alatoul',
    entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected successfully');

    const userRepository = dataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      console.error(`Error: User with email ${email} already exists`);
      if (existingUser.role !== UserRole.ADMIN) {
        console.log(`Updating existing user to admin role...`);
        existingUser.role = UserRole.ADMIN;
        existingUser.status = AccountStatus.ACTIVE;
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        await userRepository.save(existingUser);
        console.log(`✓ User updated to admin successfully!`);
        console.log(`  Email: ${email}`);
        console.log(`  Name: ${name}`);
        console.log(`  Role: Admin`);
      } else {
        console.log('User is already an admin');
      }
      await dataSource.destroy();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = userRepository.create({
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
    });

    await userRepository.save(adminUser);

    console.log('✓ Admin user created successfully!');
    console.log(`  Email: ${email}`);
    console.log(`  Name: ${name}`);
    console.log(`  Role: Admin`);
    console.log(`  Status: Active`);
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

createAdmin();
