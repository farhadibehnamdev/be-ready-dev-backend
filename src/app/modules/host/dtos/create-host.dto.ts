import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHostDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  description: string;
}
