import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class UpsertVaultDto {
  @IsString()
  @MinLength(32)
  publicKeyPem: string;

  @IsString()
  @MinLength(8)
  fingerprint: string;

  /** base64 */
  @IsString()
  wrappedPrivateKey: string;

  /** base64 */
  @IsString()
  kdfSalt: string;

  @IsInt()
  @Min(100_000)
  kdfIterations: number;

  /** base64 */
  @IsString()
  wrapIv: string;
}
