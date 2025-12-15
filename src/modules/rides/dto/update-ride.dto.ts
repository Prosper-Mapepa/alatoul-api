import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { RideStatus } from '../../../entities/ride.entity';

export class UpdateRideDto {
  @IsEnum(RideStatus)
  @IsOptional()
  status?: RideStatus;

  @IsUUID()
  @IsOptional()
  driverId?: string;

  @IsNumber()
  @IsOptional()
  acceptedFare?: number;

  @IsNumber()
  @IsOptional()
  finalFare?: number;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @IsString()
  @IsOptional()
  cancellationReason?: string;
}

