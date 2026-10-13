import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class UpsertVaultDto {
  @IsString()
  @MinLength(32)
  publicKeyPem: string;

  @IsString()
  @MinLength(8)
  fingerprint: string;

  /** base64 */
  @IsString()
  @MinLength(16)
  wrappedPrivateKey: string;

  /** base64 */
  @IsString()
  @MinLength(8)
  kdfSalt: string;

  @IsNumber()
  @Min(100_000)
  kdfIterations: number;

  /** base64 */
  @IsString()
  @MinLength(8)
  wrapIv: string;
}
