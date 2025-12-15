import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string;
    link?: string;
    metadata?: any;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async findAll(userId?: string, unreadOnly = false): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .orderBy('notification.createdAt', 'DESC')
      .take(50);

    if (userId) {
      queryBuilder.where('notification.userId = :userId', { userId });
    }

    if (unreadOnly) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
    }

    return queryBuilder.getMany();
  }

  async findUnreadCount(userId?: string): Promise<number> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.isRead = :isRead', { isRead: false });

    if (userId) {
      queryBuilder.andWhere('notification.userId = :userId', { userId });
    }

    return queryBuilder.getCount();
  }

  async markAsRead(id: string, userId?: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (userId && notification.userId !== userId) {
      throw new Error('Unauthorized');
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async createAdminNotifications() {
    // Create sample admin notifications
    const adminUsers = await this.userRepository.find({
      where: { role: UserRole.ADMIN },
    });

    for (const admin of adminUsers) {
      // Sample notifications
      const notifications = [
        {
          userId: admin.id,
          type: NotificationType.KYC_APPROVED,
          title: 'New KYC Approval',
          message: 'A driver KYC has been approved and is ready for review.',
          link: '/admin/drivers',
        },
        {
          userId: admin.id,
          type: NotificationType.SAFETY_REPORT,
          title: 'New Safety Report',
          message: 'A new safety report has been submitted and requires attention.',
          link: '/admin/safety',
        },
        {
          userId: admin.id,
          type: NotificationType.SYSTEM_ALERT,
          title: 'System Update',
          message: 'Pricing settings have been updated.',
          link: '/admin/settings',
        },
      ];

      for (const notif of notifications) {
        await this.create({
          ...notif,
          type: notif.type as NotificationType,
        });
      }
    }
  }
}
