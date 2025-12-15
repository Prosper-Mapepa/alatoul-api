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
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'alatoul'),
  entities: [User, Ride, Payment, KYC, Vehicle, Message, Rating, Settings, Notification],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: false,
});

