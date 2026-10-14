import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongAccountPassword } from './password.rules';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsStrongAccountPassword()
  password: string;
}
