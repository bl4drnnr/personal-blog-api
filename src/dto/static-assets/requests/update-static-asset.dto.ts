import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class UpdateStaticAssetDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  s3Url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['icon', 'projectPicture', 'articlePicture', 'staticAsset'])
  assetType?: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset';
}
