import { IsOptional, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  /** Required when 2FA is enabled (authenticator or recovery code). */
  @IsOptional()
  @IsString()
  code?: string;
}
