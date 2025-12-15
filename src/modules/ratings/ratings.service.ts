import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../../entities/rating.entity';
import { User } from '../../entities/user.entity';
import { Ride } from '../../entities/ride.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
  ) {}

  async create(
    userId: string,
    rideId: string,
    ratedById: string,
    rating: number,
    comment?: string,
  ): Promise<Rating> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ratedBy = await this.userRepository.findOne({ where: { id: ratedById } });
    const ride = await this.rideRepository.findOne({ where: { id: rideId } });

    if (!user || !ratedBy || !ride) {
      throw new NotFoundException('User or Ride not found');
    }

    // Check if rating already exists
    const existingRating = await this.ratingRepository.findOne({
      where: { userId, rideId, ratedById },
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
      await this.ratingRepository.save(existingRating);
      await this.updateUserAverageRating(userId);
      return existingRating;
    }

    const newRating = this.ratingRepository.create({
      user,
      userId,
      ratedBy,
      ratedById,
      ride,
      rideId,
      rating,
      comment,
    });

    const savedRating = await this.ratingRepository.save(newRating);
    await this.updateUserAverageRating(userId);

    return savedRating;
  }

  async findByUser(userId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { userId },
      relations: ['ratedBy', 'ride'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRide(rideId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { rideId },
      relations: ['ratedBy', 'user'],
    });
  }

  private async updateUserAverageRating(userId: string): Promise<void> {
    const ratings = await this.ratingRepository.find({
      where: { userId },
    });

    if (ratings.length === 0) return;

    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await this.userRepository.update(userId, {
      averageRating: parseFloat(averageRating.toFixed(2)),
    });
  }
}

