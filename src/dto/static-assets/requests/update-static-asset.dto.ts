import { IsString, IsOptional } from 'class-validator';

export class UpdateStaticAssetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  s3Url?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
