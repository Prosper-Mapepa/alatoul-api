import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  platformFeePercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumFare?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseRatePerMile?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseRatePerMinute?: number;

  @IsOptional()
  @IsString()
  platformName?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  defaultLanguage?: string;
}
