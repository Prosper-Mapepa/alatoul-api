import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { AcceptRideDto } from './dto/accept-ride.dto';
import { CancelRideDto } from './dto/cancel-ride.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { RideStatus } from '../../entities/ride.entity';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createRideDto: CreateRideDto) {
    return this.ridesService.create(user.id, createRideDto);
  }

  @Get()
  async findAll(
    @Query('role') role?: 'passenger' | 'driver',
    @Query('status') status?: RideStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @CurrentUser() user?: User,
  ) {
    try {
      return await this.ridesService.findAll(
        user?.id,
        role,
        status,
        page,
        limit,
      );
    } catch (error) {
      console.error('Error in rides controller:', error);
      throw error;
    }
  }

  @Get('pending')
  findPendingRides() {
    return this.ridesService.findPendingRides();
  }

  @Get('statistics')
  getStatistics(@CurrentUser() user: User) {
    return this.ridesService.getRideStatistics(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ridesService.findOne(id);
  }

  @Post(':id/accept')
  acceptRide(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() acceptRideDto: AcceptRideDto,
  ) {
    return this.ridesService.acceptRide(id, user.id, acceptRideDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRideDto: UpdateRideDto,
  ) {
    return this.ridesService.update(id, updateRideDto);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() cancelDto: CancelRideDto,
  ) {
    return this.ridesService.cancel(id, user.id, cancelDto.reason);
  }

  @Post(':id/end')
  endRide(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.ridesService.endRide(id, user.id);
  }

  @Get('calculate-fare')
  calculateFare(
    @Query('distance') distance: string,
    @Query('duration') duration: string,
  ) {
    const distanceInMiles = parseFloat(distance) || 0;
    const durationInMinutes = parseFloat(duration) || 0;
    return this.ridesService.calculateFare(distanceInMiles, durationInMinutes);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ridesService.remove(id);
  }
}

