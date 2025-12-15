import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { Ride } from './ride.entity';
import { Payment } from './payment.entity';
import { KYC } from './kyc.entity';
import { Message } from './message.entity';
import { Rating } from './rating.entity';
import { Vehicle } from './vehicle.entity';

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  VERIFIED = 'verified',
}

@Entity('users')
@Index(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASSENGER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({ default: 0 })
  totalRides: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  lastSeen: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Ride, (ride) => ride.passenger)
  ridesAsPassenger: Ride[];

  @OneToMany(() => Ride, (ride) => ride.driver)
  ridesAsDriver: Ride[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToOne(() => KYC, (kyc) => kyc.user)
  kyc: KYC;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Rating, (rating) => rating.ratedBy)
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratingsReceived: Rating[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver)
  vehicles: Vehicle[];
}

