import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class RewrapKeyItemDto {
  @IsUUID()
  fileId: string;

  /** base64 RSA-OAEP wrapped AES key */
  @IsString()
  @IsNotEmpty()
  wrappedAesKey: string;
}

export class RewrapKeysDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RewrapKeyItemDto)
  updates: RewrapKeyItemDto[];
}
