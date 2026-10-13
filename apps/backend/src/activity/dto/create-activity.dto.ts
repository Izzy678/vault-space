import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateActivityDto {
  @IsIn(['upload', 'download', 'share', 'key', 'auth', 'delete'])
  type: 'upload' | 'download' | 'share' | 'key' | 'auth' | 'delete';

  @IsString()
  @MinLength(1)
  label: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  device?: string;
}
