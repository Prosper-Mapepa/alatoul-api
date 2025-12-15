import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { KYCService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { KYC, KYCStatus } from '../../entities/kyc.entity';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KYCController {
  constructor(private readonly kycService: KYCService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() kycData: Partial<KYC>) {
    return this.kycService.create(user.id, kycData);
  }

  @Get()
  async findOne(@CurrentUser() user: User) {
    const kyc = await this.kycService.findOne(user.id);
    // Return empty object instead of null for consistency
    return kyc || {};
  }

  @Patch()
  update(@CurrentUser() user: User, @Body() kycData: Partial<KYC>) {
    return this.kycService.update(user.id, kycData);
  }

  @Patch('status')
  updateStatus(
    @Body('userId') userId: string,
    @Body('status') status: KYCStatus,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.kycService.updateStatus(userId, status, rejectionReason);
  }

  @Get('all')
  findAll(@Query('status') status?: KYCStatus) {
    return this.kycService.findAll(status);
  }
}

