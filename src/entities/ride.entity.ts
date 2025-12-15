import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';

export enum RideStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RideType {
  NOW = 'now',
  SCHEDULED = 'scheduled',
}

@Entity('rides')
@Index(['passenger'])
@Index(['driver'])
@Index(['status'])
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.ridesAsPassenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;

  @Column({ name: 'passenger_id' })
  passengerId: string;

  @ManyToOne(() => User, (user) => user.ridesAsDriver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({
    type: 'enum',
    enum: RideType,
    default: RideType.NOW,
  })
  type: RideType;

  @Column({
    type: 'enum',
    enum: RideStatus,
    default: RideStatus.PENDING,
  })
  status: RideStatus;

  @Column()
  pickupLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  pickupLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  pickupLongitude: number;

  @Column()
  destination: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  destinationLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  destinationLongitude: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  proposedFare: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  acceptedFare: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  finalFare: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  distance: number;

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number;

  @Column({ type: 'int', default: 1 })
  passengers: number;

  @Column({ nullable: true })
  scheduledDate: Date;

  @Column({ nullable: true })
  scheduledTime: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Payment, (payment) => payment.ride, { nullable: true })
  payment: Payment;
}

