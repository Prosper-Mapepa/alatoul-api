import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride, RideStatus } from '../../entities/ride.entity';
import { User } from '../../entities/user.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { AcceptRideDto } from './dto/accept-ride.dto';
import { SettingsService } from '../settings/settings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../entities/notification.entity';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createRideDto: CreateRideDto): Promise<Ride> {
    const passenger = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!passenger) {
      throw new NotFoundException('User not found');
    }

    const ride = this.rideRepository.create({
      ...createRideDto,
      passenger,
      passengerId: userId,
      status: RideStatus.PENDING,
      scheduledDate: createRideDto.scheduledDate
        ? new Date(createRideDto.scheduledDate)
        : null,
      distance: createRideDto.distance || null,
      estimatedDuration: createRideDto.estimatedDuration || null,
    });

    return this.rideRepository.save(ride);
  }

  async findAll(
    userId?: string,
    role?: 'passenger' | 'driver',
    status?: RideStatus,
    page = 1,
    limit = 10,
  ): Promise<{ rides: Ride[]; total: number; page: number; limit: number }> {
    try {
      const queryBuilder = this.rideRepository
        .createQueryBuilder('ride')
        .leftJoinAndSelect('ride.passenger', 'passenger')
        .leftJoinAndSelect('ride.driver', 'driver');

      if (userId && role === 'passenger') {
        queryBuilder.where('ride.passengerId = :userId', { userId });
      } else if (userId && role === 'driver') {
        queryBuilder.where('ride.driverId = :userId', { userId });
      } else if (!userId && role) {
        // If role is specified but no userId, return empty results
        return {
          rides: [],
          total: 0,
          page,
          limit,
        };
      }

      if (status) {
        queryBuilder.andWhere('ride.status = :status', { status });
      }

      queryBuilder.orderBy('ride.createdAt', 'DESC');

      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      const [rides, total] = await queryBuilder.getManyAndCount();

      return {
        rides: rides || [],
        total: total || 0,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error fetching rides:', error);
      // Return empty result instead of throwing
      return {
        rides: [],
        total: 0,
        page,
        limit,
      };
    }
  }

  async findOne(id: string): Promise<Ride> {
    try {
      const ride = await this.rideRepository.findOne({
        where: { id },
        relations: ['passenger', 'driver'],
      });

      if (!ride) {
        throw new NotFoundException(`Ride with ID ${id} not found`);
      }

      return ride;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding ride:', error);
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
  }

  async findPendingRides(): Promise<Ride[]> {
    try {
      return await this.rideRepository.find({
        where: { status: RideStatus.PENDING },
        relations: ['passenger'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error finding pending rides:', error);
      return [];
    }
  }

  async calculateFare(
    distanceInMiles: number,
    durationInMinutes: number,
  ): Promise<{ baseFare: number; finalFare: number; platformFee: number; driverEarning: number }> {
    return this.settingsService.calculateFare(distanceInMiles, durationInMinutes);
  }

  async acceptRide(
    rideId: string,
    driverId: string,
    acceptRideDto: AcceptRideDto,
  ): Promise<Ride> {
    const ride = await this.findOne(rideId);

    if (ride.status !== RideStatus.PENDING && ride.status !== RideStatus.ACCEPTED) {
      throw new BadRequestException('Ride is not available for acceptance');
    }

    const driver = await this.userRepository.findOne({
      where: { id: driverId },
    });

    if (!driver || driver.role !== 'driver') {
      throw new NotFoundException('Driver not found');
    }

    // If driver is already assigned and is countering, update the fare
    if (ride.status === RideStatus.ACCEPTED && ride.driverId === driverId && acceptRideDto.counterOffer) {
      ride.acceptedFare = acceptRideDto.counterOffer;
      return this.rideRepository.save(ride);
    }

    // First acceptance
    ride.driver = driver;
    ride.driverId = driverId;
    ride.status = RideStatus.ACCEPTED;

    if (acceptRideDto.counterOffer) {
      ride.acceptedFare = acceptRideDto.counterOffer;
    } else {
      ride.acceptedFare = ride.proposedFare;
    }

    return this.rideRepository.save(ride);
  }

  async endRide(rideId: string, userId: string): Promise<Ride> {
    const ride = await this.findOne(rideId);

    if (
      ride.passengerId !== userId &&
      ride.driverId !== userId
    ) {
      throw new ForbiddenException('You do not have permission to end this ride');
    }

    if (ride.status !== RideStatus.IN_PROGRESS) {
      throw new BadRequestException('Ride must be in progress to be ended');
    }

    ride.status = RideStatus.COMPLETED;
    ride.completedAt = new Date();
    ride.finalFare = ride.finalFare || ride.acceptedFare || ride.proposedFare;

    return this.rideRepository.save(ride);
  }

  async update(id: string, updateRideDto: UpdateRideDto): Promise<Ride> {
    const ride = await this.findOne(id);

    Object.assign(ride, updateRideDto);

    // Update timestamps based on status
    if (updateRideDto.status === RideStatus.IN_PROGRESS && !ride.startedAt) {
      ride.startedAt = new Date();
    }

    if (updateRideDto.status === RideStatus.COMPLETED && !ride.completedAt) {
      ride.completedAt = new Date();
      ride.finalFare = ride.finalFare || ride.acceptedFare || ride.proposedFare;
    }

    if (updateRideDto.status === RideStatus.CANCELLED && !ride.cancelledAt) {
      ride.cancelledAt = new Date();
    }

    return this.rideRepository.save(ride);
  }

  async cancel(rideId: string, userId: string, reason?: string): Promise<Ride> {
    const ride = await this.findOne(rideId);

    if (
      ride.passengerId !== userId &&
      ride.driverId !== userId
    ) {
      throw new ForbiddenException('You do not have permission to cancel this ride');
    }

    if (
      ride.status === RideStatus.COMPLETED ||
      ride.status === RideStatus.CANCELLED
    ) {
      throw new BadRequestException('Cannot cancel a completed or already cancelled ride');
    }

    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Cancellation reason is required');
    }

    ride.status = RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancellationReason = reason;

    const savedRide = await this.rideRepository.save(ride);

    // Notify the other party about the cancellation
    try {
      let otherUserId: string | null = null;
      
      // If passenger is cancelling, notify driver (if driver exists)
      if (ride.passengerId === userId) {
        otherUserId = ride.driverId || null;
      } 
      // If driver is cancelling, always notify passenger
      else if (ride.driverId === userId) {
        otherUserId = ride.passengerId || null;
      }

      if (otherUserId) {
        const canceller = await this.userRepository.findOne({ where: { id: userId } });
        const cancellerName = canceller?.name || canceller?.email?.split('@')[0] || 'User';
        
        await this.notificationsService.create({
          userId: otherUserId,
          type: NotificationType.RIDE_CANCELLED,
          title: 'Ride Cancelled',
          message: `${cancellerName} cancelled the ride. Reason: ${reason}`,
          relatedId: rideId,
          link: `/rides/${rideId}`,
        });
      }
    } catch (error) {
      // Log error but don't fail the cancellation
      console.error('Failed to create cancellation notification:', error);
    }

    return savedRide;
  }

  async remove(id: string): Promise<void> {
    const ride = await this.findOne(id);
    await this.rideRepository.remove(ride);
  }

  async getRideStatistics(userId?: string) {
    const queryBuilder = this.rideRepository.createQueryBuilder('ride');

    if (userId) {
      queryBuilder.where('ride.passengerId = :userId', { userId });
    }

    const totalRides = await queryBuilder.getCount();

    const completedRides = await this.rideRepository.count({
      where: { status: RideStatus.COMPLETED },
    });

    const pendingRides = await this.rideRepository.count({
      where: { status: RideStatus.PENDING },
    });

    const inProgressRides = await this.rideRepository.count({
      where: { status: RideStatus.IN_PROGRESS },
    });

    return {
      totalRides,
      completedRides,
      pendingRides,
      inProgressRides,
    };
  }
}

