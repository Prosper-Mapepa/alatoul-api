import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../entities/vehicle.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(driverId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    try {
      console.log('VehiclesService.create called with:', { driverId, vehicleData });
      const driver = await this.userRepository.findOne({ where: { id: driverId } });
      console.log('Driver found:', driver ? { id: driver.id, role: driver.role } : 'null');

      if (!driver || driver.role !== 'driver') {
        throw new NotFoundException('Driver not found');
      }

      // Prepare vehicle data with proper type conversions
      const preparedData: any = {
        ...vehicleData,
        color: vehicleData.color || 'Not specified',
        isActive: vehicleData.isActive !== undefined ? vehicleData.isActive : true,
        driver,
        driverId,
      };

      // Convert insuranceExpiry to Date if it's a string
      if (preparedData.insuranceExpiry) {
        if (typeof preparedData.insuranceExpiry === 'string') {
          // Handle both ISO string and YYYY-MM-DD formats
          const dateStr = preparedData.insuranceExpiry.trim();
          if (dateStr) {
            preparedData.insuranceExpiry = new Date(dateStr);
            // Validate the date
            if (isNaN(preparedData.insuranceExpiry.getTime())) {
              throw new BadRequestException(`Invalid insurance expiry date: ${dateStr}`);
            }
          } else {
            preparedData.insuranceExpiry = null;
          }
        }
      } else {
        preparedData.insuranceExpiry = null;
      }

      // Validate required fields
      if (!preparedData.make || !preparedData.model || !preparedData.year || !preparedData.plateNumber || !preparedData.type) {
        throw new BadRequestException('Missing required fields: make, model, year, plateNumber, and type are required');
      }

      // Validate vehicle type enum
      const validTypes = ['sedan', 'suv', 'van', 'motorcycle'];
      if (!validTypes.includes(preparedData.type)) {
        throw new BadRequestException(`Invalid vehicle type. Must be one of: ${validTypes.join(', ')}`);
      }

      console.log('Creating vehicle entity with data:', JSON.stringify(preparedData, null, 2));
      const vehicle = this.vehicleRepository.create(preparedData);
      console.log('Vehicle entity created, attempting to save...');

      try {
        const savedVehicle = await this.vehicleRepository.save(vehicle);
        const finalVehicle = Array.isArray(savedVehicle) ? savedVehicle[0] : savedVehicle;
        console.log('Vehicle saved successfully:', finalVehicle.id);
        return finalVehicle;
      } catch (saveError: any) {
        console.error('Error during vehicle save:', saveError);
        console.error('Save error details:', {
          code: saveError.code,
          detail: saveError.detail,
          message: saveError.message,
          sqlState: saveError.sqlState,
          sqlMessage: saveError.sqlMessage,
        });
        throw saveError;
      }
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      console.error('Vehicle data received:', JSON.stringify(vehicleData, null, 2));
      
      // Handle database constraint violations
      if (error.code === '23505') { // PostgreSQL unique violation
        if (error.detail?.includes('plateNumber') || error.detail?.includes('plate_number')) {
          throw new ConflictException('A vehicle with this license plate already exists');
        }
        throw new ConflictException('Vehicle registration failed due to duplicate entry');
      }
      
      // Handle other database errors
      if (error.code === '23502') { // PostgreSQL not-null violation
        const missingField = error.column || 'unknown';
        throw new BadRequestException(`Missing required field: ${missingField}`);
      }
      
      // Re-throw HttpException as-is
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      
      // Wrap other errors with more details
      const errorMessage = error.message || 'Failed to create vehicle';
      console.error('Unhandled error details:', {
        message: errorMessage,
        code: error.code,
        detail: error.detail,
        stack: error.stack,
        name: error.name,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
      });
      
      // Return more detailed error message for debugging
      const detailedMessage = error.detail || error.sqlMessage || errorMessage;
      throw new BadRequestException(detailedMessage);
    }
  }

  async findOne(driverId: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { driverId, isActive: true },
      relations: ['driver'],
      order: { createdAt: 'DESC' },
    });

    // Return null instead of throwing - allows frontend to handle gracefully
    return vehicle || null;
  }

  async findAllByDriver(driverId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { driverId },
      relations: ['driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(vehicleId: string, driverId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId, driverId },
      relations: ['driver'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(vehicleId: string, driverId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = await this.findById(vehicleId, driverId);
    
    Object.assign(vehicle, vehicleData);
    return this.vehicleRepository.save(vehicle);
  }

  async delete(vehicleId: string, driverId: string): Promise<void> {
    const vehicle = await this.findById(vehicleId, driverId);
    
    // Soft delete by setting isActive to false
    vehicle.isActive = false;
    await this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    try {
      return await this.vehicleRepository.find({
        relations: ['driver'],
        where: { isActive: true },
      });
    } catch (error) {
      console.error('Error finding vehicles:', error);
      return [];
    }
  }
}

