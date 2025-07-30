import { IsString, IsOptional } from 'class-validator';

export class CreateStaticAssetDto {
  @IsString()
  name: string;

  @IsString()
  s3Url: string;

  @IsOptional()
  @IsString()
  description?: string;
}
