import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsStrongAccountPassword } from './password.rules';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @IsStrongAccountPassword()
  newPassword: string;

  /** Required when 2FA is enabled (authenticator or recovery code). */
  @IsOptional()
  @IsString()
  code?: string;
}
