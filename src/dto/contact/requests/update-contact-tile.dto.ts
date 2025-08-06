import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class UpdateContactTileDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsUUID()
  iconAssetId?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
