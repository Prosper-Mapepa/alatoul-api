import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { Ride } from '../../entities/ride.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
  ) {}

  async create(
    userId: string,
    rideId: string,
    amount: number,
    method: string,
  ): Promise<Payment> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ride = await this.rideRepository.findOne({ where: { id: rideId } });

    if (!user || !ride) {
      throw new NotFoundException('User or Ride not found');
    }

    const payment = this.paymentRepository.create({
      user,
      userId,
      ride,
      rideId,
      amount,
      method: method as any,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll(userId?: string): Promise<Payment[]> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.ride', 'ride')
      .orderBy('payment.createdAt', 'DESC');

    if (userId) {
      queryBuilder.where('payment.userId = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'ride'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = status;

    if (status === PaymentStatus.COMPLETED) {
      payment.completedAt = new Date();
    } else if (status === PaymentStatus.FAILED) {
      payment.failedAt = new Date();
    }

    return this.paymentRepository.save(payment);
  }

  async getEarnings(userId: string, startDate?: Date, endDate?: Date) {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.userId = :userId', { userId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED });

    if (startDate) {
      queryBuilder.andWhere('payment.completedAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('payment.completedAt <= :endDate', { endDate });
    }

    const result = await queryBuilder
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    return {
      totalEarnings: parseFloat(result.total) || 0,
    };
  }
}

