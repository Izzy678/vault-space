import { IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateShareDto {
  @IsUUID()
  fileId: string;

  /** Prefer sharing via an existing Keys contact */
  @IsOptional()
  @IsUUID()
  contactId?: string;

  /** Or look up a VaultSpace user by email */
  @IsOptional()
  @IsString()
  recipientEmail?: string;

  /** base64 — AES key wrapped to the recipient's public key (browser crypto) */
  @IsString()
  @MinLength(16)
  wrappedAesKey: string;

  @IsOptional()
  @IsIn(['view', 'download'])
  permission?: 'view' | 'download';
}
