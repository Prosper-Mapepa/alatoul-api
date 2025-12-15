import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AccountStatus } from '../../../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(AccountStatus)
  @IsOptional()
  status?: AccountStatus;

  @IsOptional()
  dateOfBirth?: Date;
}

