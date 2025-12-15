import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, default: 'default' })
  key: string;

  // Pricing Settings
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  platformFeePercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 5 })
  minimumFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1.5 })
  baseRatePerMile: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.3 })
  baseRatePerMinute: number;

  // General Settings
  @Column({ nullable: true })
  platformName: string;

  @Column({ nullable: true })
  supportEmail: string;

  @Column({ nullable: true })
  supportPhone: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true, default: 'en' })
  defaultLanguage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
