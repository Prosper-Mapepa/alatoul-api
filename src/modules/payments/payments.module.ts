import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { Ride } from '../../entities/ride.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, Ride])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

