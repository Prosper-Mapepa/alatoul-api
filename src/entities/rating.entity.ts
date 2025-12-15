import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Ride } from './ride.entity';

@Entity('ratings')
@Index(['user'])
@Index(['ride'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.ratingsReceived)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.ratingsGiven)
  @JoinColumn({ name: 'rated_by_id' })
  ratedBy: User;

  @Column({ name: 'rated_by_id' })
  ratedById: string;

  @ManyToOne(() => Ride)
  @JoinColumn({ name: 'ride_id' })
  ride: Ride;

  @Column({ name: 'ride_id' })
  rideId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

