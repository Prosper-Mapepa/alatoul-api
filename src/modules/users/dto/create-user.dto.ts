import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  role: UserRole;
}

