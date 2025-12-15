import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CancelRideDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Cancellation reason must be at least 5 characters' })
  reason: string;
}
