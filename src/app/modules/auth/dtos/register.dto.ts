import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  role?: RoleTypeEnum;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
