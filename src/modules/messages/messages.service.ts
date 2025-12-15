import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { User } from '../../entities/user.entity';
import { Ride, RideStatus } from '../../entities/ride.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
  ) {}

  async canSendMessage(
    senderId: string,
    receiverId: string,
    rideId: string,
  ): Promise<boolean> {
    if (!rideId) {
      return false;
    }

    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['passenger', 'driver'],
    });

    if (!ride) {
      return false;
    }

    // Check if both parties are part of the ride
    const isPassenger = ride.passengerId === senderId;
    const isDriver = ride.driverId === senderId;
    const isReceiverPassenger = ride.passengerId === receiverId;
    const isReceiverDriver = ride.driverId === receiverId;

    if (!((isPassenger && isReceiverDriver) || (isDriver && isReceiverPassenger))) {
      return false;
    }

    // Check if ride is accepted by both parties
    // Messages can be sent when ride status is ACCEPTED, DRIVER_ASSIGNED, DRIVER_ARRIVED, or IN_PROGRESS
    const allowedStatuses = [
      RideStatus.ACCEPTED,
      RideStatus.DRIVER_ASSIGNED,
      RideStatus.DRIVER_ARRIVED,
      RideStatus.IN_PROGRESS,
    ];

    return allowedStatuses.includes(ride.status);
  }

  async create(
    senderId: string,
    receiverId: string,
    content: string,
    rideId?: string,
  ): Promise<Message> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    // Validate ride acceptance if rideId is provided
    if (rideId) {
      const canMessage = await this.canSendMessage(senderId, receiverId, rideId);
      if (!canMessage) {
        throw new ForbiddenException(
          'Messages can only be sent when ride is accepted by both parties',
        );
      }
    }

    const message = this.messageRepository.create({
      sender,
      senderId,
      receiver,
      receiverId,
      content,
      ride: rideId ? await this.rideRepository.findOne({ where: { id: rideId } }) : null,
      rideId: rideId || null,
    });

    return this.messageRepository.save(message);
  }

  async findConversation(
    userId1: string,
    userId2: string,
    rideId?: string,
  ): Promise<Message[]> {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where(
        '(message.senderId = :userId1 AND message.receiverId = :userId2) OR (message.senderId = :userId2 AND message.receiverId = :userId1)',
        { userId1, userId2 },
      );

    if (rideId) {
      queryBuilder.andWhere('message.rideId = :rideId', { rideId });
    }

    queryBuilder.orderBy('message.createdAt', 'ASC');

    return queryBuilder.getMany();
  }

  async markAsRead(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.isRead = true;
    message.readAt = new Date();

    return this.messageRepository.save(message);
  }

  async findUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }
}

