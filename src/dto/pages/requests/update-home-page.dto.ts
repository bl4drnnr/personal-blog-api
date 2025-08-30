import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateHomePageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  @IsString()
  heroImageMainId?: string;

  @IsOptional()
  @IsString()
  heroImageSecondaryId?: string;

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
  @IsString()
  marqueeLeftText?: string;

  @IsOptional()
  @IsString()
  marqueeRightText?: string;

  @IsOptional()
  @IsString()
  latestProjectsTitle?: string;

  @IsOptional()
  @IsString()
  latestPostsTitle?: string;

  @IsOptional()
  @IsString()
  whySectionTitle?: string;

  @IsOptional()
  @IsString()
  faqSectionTitle?: string;

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
