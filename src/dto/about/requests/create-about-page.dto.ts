import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAboutPageDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsString()
  heroImageMain?: string;

  @IsOptional()
  @IsString()
  heroImageSecondary?: string;

  @IsOptional()
  @IsString()
  heroImageMainAlt?: string;

  @IsOptional()
  @IsString()
  heroImageSecondaryAlt?: string;

  @IsOptional()
  @IsString()
  logoText?: string;

  @IsOptional()
  @IsString()
  breadcrumbText?: string;

  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsObject()
  contactTiles?: object;

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
  ogImage?: string;

  @IsOptional()
  @IsObject()
  structuredData?: object;
}
