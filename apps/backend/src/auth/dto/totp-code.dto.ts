import { IsString, Length, Matches } from 'class-validator';

export class TotpCodeDto {
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Code must be 6 digits' })
  code: string;
}

export class TotpDisableDto {
  /** Authenticator code or a recovery code (XXXX-XXXX). */
  @IsString()
  @Length(6, 16)
  code: string;
}

export class TotpLoginDto {
  @IsString()
  preAuthToken: string;

  @IsString()
  @Length(6, 16)
  code: string;
}
