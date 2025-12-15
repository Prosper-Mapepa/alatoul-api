import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { Vehicle } from '../../entities/vehicle.entity';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@CurrentUser() user: User, @Body() vehicleData: Partial<Vehicle>) {
    try {
      console.log('Creating vehicle for user:', user.id);
      console.log('Vehicle data received:', JSON.stringify(vehicleData, null, 2));
      const result = await this.vehiclesService.create(user.id, vehicleData);
      console.log('Vehicle created successfully:', result.id);
      return result;
    } catch (error: any) {
      console.error('Error in vehicle controller:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        name: error.name,
      });
      throw error;
    }
  }

  @Get('all')
  async findAllByDriver(@CurrentUser() user: User) {
    return this.vehiclesService.findAllByDriver(user.id);
  }

  @Get()
  async findOne(@CurrentUser() user: User) {
    const vehicle = await this.vehiclesService.findOne(user.id);
    // Return empty object instead of null for consistency
    return vehicle || {};
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.vehiclesService.findById(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() vehicleData: Partial<Vehicle>
  ) {
    return this.vehiclesService.update(id, user.id, vehicleData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.vehiclesService.delete(id, user.id);
    return { message: 'Vehicle deleted successfully' };
  }

  @Get('all/public')
  findAll() {
    return this.vehiclesService.findAll();
  }
}

