import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum KYCStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('kyc')
export class KYC {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.kyc)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING,
  })
  status: KYCStatus;

  // Personal Information
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  country: string;

  // ID Verification
  @Column({ nullable: true })
  idType: string;

  @Column({ nullable: true })
  idNumber: string;

  @Column({ nullable: true })
  idFrontImage: string;

  @Column({ nullable: true })
  idBackImage: string;

  @Column({ nullable: true })
  idExpiryDate: Date;

  // Driver Specific
  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ nullable: true })
  licenseImage: string;

  @Column({ nullable: true })
  licenseExpiryDate: Date;

  @Column({ nullable: true })
  licenseIssuedDate: Date;

  // Vehicle Information (for drivers)
  @Column({ nullable: true })
  vehicleMake: string;

  @Column({ nullable: true })
  vehicleModel: string;

  @Column({ nullable: true })
  vehicleYear: number;

  @Column({ nullable: true })
  vehiclePlateNumber: string;

  @Column({ nullable: true })
  vehicleRegistrationImage: string;

  // Payment Setup
  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  accountHolderName: string;

  @Column({ nullable: true })
  mobileMoneyNumber: string;

  @Column({ nullable: true })
  mobileMoneyProvider: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

