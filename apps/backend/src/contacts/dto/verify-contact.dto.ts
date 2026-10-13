import { IsBoolean } from 'class-validator';

export class VerifyContactDto {
  @IsBoolean()
  verified: boolean;
}
