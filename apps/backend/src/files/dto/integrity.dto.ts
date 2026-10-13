import { IsBoolean } from 'class-validator';

export class IntegrityDto {
  @IsBoolean()
  verified: boolean;
}
