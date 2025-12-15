import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../../entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async getSettings(): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({
      where: { key: 'default' },
    });

    if (!settings) {
      // Create default settings if none exist
      settings = this.settingsRepository.create({
        key: 'default',
        platformFeePercent: 20,
        minimumFare: 5,
        baseRatePerMile: 1.5,
        baseRatePerMinute: 0.3,
        platformName: 'Alatoul',
        supportEmail: 'support@alatoul.com',
        supportPhone: '+1 (555) 123-4567',
        timezone: 'UTC-5',
        defaultLanguage: 'en',
      });
      settings = await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({
      where: { key: 'default' },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        key: 'default',
        ...data,
      });
    } else {
      Object.assign(settings, data);
    }

    return this.settingsRepository.save(settings);
  }

  async updatePricingSettings(data: {
    platformFeePercent?: number;
    minimumFare?: number;
    baseRatePerMile?: number;
    baseRatePerMinute?: number;
  }): Promise<Settings> {
    return this.updateSettings(data);
  }

  async calculateFare(
    distanceInMiles: number,
    durationInMinutes: number,
  ): Promise<{ baseFare: number; finalFare: number; platformFee: number; driverEarning: number }> {
    const settings = await this.getSettings();

    const baseFare =
      distanceInMiles * Number(settings.baseRatePerMile) +
      durationInMinutes * Number(settings.baseRatePerMinute);

    const finalFare = Math.max(baseFare, Number(settings.minimumFare));
    const platformFee = (finalFare * Number(settings.platformFeePercent)) / 100;
    const driverEarning = finalFare - platformFee;

    return {
      baseFare: Number(baseFare.toFixed(2)),
      finalFare: Number(finalFare.toFixed(2)),
      platformFee: Number(platformFee.toFixed(2)),
      driverEarning: Number(driverEarning.toFixed(2)),
    };
  }
}
