import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class RewrapKeyItemDto {
  @IsUUID()
  fileId: string;

  /** base64 RSA-OAEP wrapped AES key */
  @IsString()
  wrappedAesKey: string;
}

export class RewrapKeysDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RewrapKeyItemDto)
  updates: RewrapKeyItemDto[];
}
