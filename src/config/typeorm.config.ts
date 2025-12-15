import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { Ride } from '../entities/ride.entity';
import { Payment } from '../entities/payment.entity';
import { KYC } from '../entities/kyc.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Message } from '../entities/message.entity';
import { Rating } from '../entities/rating.entity';
import { Settings } from '../entities/settings.entity';
import { Notification } from '../entities/notification.entity';

// Load environment variables
config();

const configService = new ConfigService();

// Support Railway's DATABASE_URL or individual variables
const databaseUrl = configService.get<string>('DATABASE_URL');

let dataSourceOptions: any;

if (databaseUrl) {
  // Parse DATABASE_URL (format: postgresql://user:password@host:port/database)
  const url = new URL(databaseUrl);
  dataSourceOptions = {
    type: 'postgres',
    host: url.hostname,
    port: parseInt(url.port, 10) || 5432,
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
    entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating, Settings, Notification],
    migrations: process.env.NODE_ENV === 'production' 
      ? ['dist/src/migrations/*.js'] 
      : ['src/migrations/*.ts'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
} else {
  // Fallback to individual environment variables
  dataSourceOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: parseInt(configService.get('DB_PORT', '5432'), 10),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'alatoul'),
    entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating, Settings, Notification],
    migrations: process.env.NODE_ENV === 'production' 
      ? ['dist/src/migrations/*.js'] 
      : ['src/migrations/*.ts'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
}

export default new DataSource(dataSourceOptions);
