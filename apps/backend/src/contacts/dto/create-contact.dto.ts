import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsEmail()
  email: string;

  /** Display name; defaults from email local-part or looked-up user */
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  /** If omitted, server looks up a VaultSpace user by email and uses their vault public key */
  @IsOptional()
  @IsString()
  @MinLength(32)
  publicKeyPem?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  fingerprint?: string;
}
