import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { PaymentStatus } from '../../entities/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body('rideId') rideId: string,
    @Body('amount') amount: number,
    @Body('method') method: string,
  ) {
    return this.paymentsService.create(user.id, rideId, amount, method);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.paymentsService.findAll(user.id);
  }

  @Get('earnings')
  getEarnings(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.paymentsService.getEarnings(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentsService.updateStatus(id, status);
  }
}

