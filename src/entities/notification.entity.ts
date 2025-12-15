import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  RIDE_REQUEST = 'ride_request',
  RIDE_ACCEPTED = 'ride_accepted',
  RIDE_CANCELLED = 'ride_cancelled',
  RIDE_COMPLETED = 'ride_completed',
  PAYMENT_RECEIVED = 'payment_received',
  KYC_APPROVED = 'kyc_approved',
  KYC_REJECTED = 'kyc_rejected',
  DRIVER_APPROVED = 'driver_approved',
  DRIVER_SUSPENDED = 'driver_suspended',
  SYSTEM_ALERT = 'system_alert',
  SAFETY_REPORT = 'safety_report',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  relatedId: string; // ID of related entity (ride, payment, etc.)

  @Column({ nullable: true })
  link: string; // Link to related page

  @Column({ type: 'json', nullable: true })
  metadata: any; // Additional data

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
