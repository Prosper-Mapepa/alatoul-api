import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Ride } from '../entities/ride.entity';
import { Payment } from '../entities/payment.entity';
import { KYC } from '../entities/kyc.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Message } from '../entities/message.entity';
import { Rating } from '../entities/rating.entity';
import { Settings } from '../entities/settings.entity';
import { Notification } from '../entities/notification.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Support Railway's DATABASE_URL or individual variables
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  // Allow explicit control via DB_SYNCHRONIZE env var, otherwise use NODE_ENV
  // For initial setup on Railway, set DB_SYNCHRONIZE=true to create tables
  const shouldSynchronize = configService.get<string>('DB_SYNCHRONIZE') === 'true' 
    ? true 
    : configService.get('NODE_ENV') !== 'production';
  
  if (databaseUrl) {
    // Parse DATABASE_URL (format: postgresql://user:password@host:port/database)
    const url = new URL(databaseUrl);
    return {
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port, 10) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating, Settings, Notification],
      synchronize: shouldSynchronize,
      logging: configService.get('NODE_ENV') === 'development',
      migrations: ['dist/src/migrations/**/*.js'],
      migrationsRun: true, // Automatically run migrations on startup
      ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
  
  // Fallback to individual environment variables
  return {
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: parseInt(configService.get('DB_PORT', '5432'), 10),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'alatoul'),
    entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating, Settings, Notification],
    synchronize: shouldSynchronize,
    logging: configService.get('NODE_ENV') === 'development',
    migrations: ['dist/src/migrations/**/*.js'],
    migrationsRun: true, // Automatically run migrations on startup
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
};

