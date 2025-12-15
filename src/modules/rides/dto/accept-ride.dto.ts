import { IsNumber, IsOptional, Min } from 'class-validator';

export class AcceptRideDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  counterOffer?: number;
}

