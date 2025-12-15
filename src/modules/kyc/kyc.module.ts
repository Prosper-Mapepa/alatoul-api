import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KYCService } from './kyc.service';
import { KYCController } from './kyc.controller';
import { KYC } from '../../entities/kyc.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KYC, User])],
  controllers: [KYCController],
  providers: [KYCService],
  exports: [KYCService],
})
export class KYCModule {}

