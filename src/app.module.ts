import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RidesModule } from './modules/rides/rides.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { KYCModule } from './modules/kyc/kyc.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { MessagesModule } from './modules/messages/messages.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RidesModule,
    PaymentsModule,
    KYCModule,
    VehiclesModule,
    MessagesModule,
    RatingsModule,
    SettingsModule,
    NotificationsModule,
  ],
})
export class AppModule {}

