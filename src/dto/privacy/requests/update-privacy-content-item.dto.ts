import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdatePrivacyContentItemDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  items?: string[];

  @IsOptional()
  @IsString()
  linkText?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
