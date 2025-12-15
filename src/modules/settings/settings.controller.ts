import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    // Allow public access to read settings (needed for fare calculations)
    return this.settingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
    // Only authenticated users (admins) can update settings
    return this.settingsService.updateSettings(updateSettingsDto);
  }

  @Put('pricing')
  @UseGuards(JwtAuthGuard)
  async updatePricingSettings(
    @Body()
    pricingData: {
      platformFeePercent?: number;
      minimumFare?: number;
      baseRatePerMile?: number;
      baseRatePerMinute?: number;
    },
  ) {
    // Only authenticated users (admins) can update pricing
    return this.settingsService.updatePricingSettings(pricingData);
  }
}
