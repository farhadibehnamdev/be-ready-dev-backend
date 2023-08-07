import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: RoleTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  isEmailVerified: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;

  @IsNotEmpty()
  passwordChangedAt?: Date;

  @IsString()
  avatar: string;
}
