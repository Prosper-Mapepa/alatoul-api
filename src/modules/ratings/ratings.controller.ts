import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body('userId') userId: string,
    @Body('rideId') rideId: string,
    @Body('rating') rating: number,
    @Body('comment') comment?: string,
  ) {
    return this.ratingsService.create(userId, rideId, user.id, rating, comment);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ratingsService.findByUser(userId);
  }

  @Get('ride/:rideId')
  findByRide(@Param('rideId') rideId: string) {
    return this.ratingsService.findByRide(rideId);
  }
}

