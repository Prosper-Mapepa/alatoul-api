import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  IsInt,
  MinLength,
} from 'class-validator';
import { RideType } from '../../../entities/ride.entity';

export class CreateRideDto {
  @IsString()
  @MinLength(5)
  pickupLocation: string;

  @IsNumber()
  @IsOptional()
  pickupLatitude?: number;

  @IsNumber()
  @IsOptional()
  pickupLongitude?: number;

  @IsString()
  @MinLength(5)
  destination: string;

  @IsNumber()
  @IsOptional()
  destinationLatitude?: number;

  @IsNumber()
  @IsOptional()
  destinationLongitude?: number;

  @IsNumber()
  @Min(1)
  proposedFare: number;

  @IsEnum(RideType)
  type: RideType;

  @IsInt()
  @Min(1)
  passengers: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsString()
  @IsOptional()
  scheduledTime?: string;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;
}

