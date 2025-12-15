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

export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  VAN = 'van',
  MOTORCYCLE = 'motorcycle',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  color: string;

  @Column()
  plateNumber: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({ nullable: true })
  capacity: number;

  @Column({ nullable: true })
  registrationImage: string;

  @Column({ nullable: true })
  insuranceImage: string;

  @Column({ nullable: true })
  insuranceExpiry: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

