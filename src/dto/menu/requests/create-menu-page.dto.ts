import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateMenuPageDto {
  @IsString()
  @IsString()
  heroImageMainId: string;

  @IsString()
  heroImageMainAlt: string;

  @IsString()
  logoText: string;

  @IsString()
  breadcrumbText: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsString()
  ogImageId?: string;

  @IsOptional()
  @IsObject()
  structuredData?: object;
}
