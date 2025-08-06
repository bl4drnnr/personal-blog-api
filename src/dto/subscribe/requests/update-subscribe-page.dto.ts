import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class UpdateSubscribePageDto {
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
  footerText?: string;

  @IsOptional()
  @IsUUID()
  heroImageMainId?: string;

  @IsOptional()
  @IsUUID()
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
  heroDesc?: string;

  @IsOptional()
  @IsString()
  carouselWords?: string;

  @IsOptional()
  @IsString()
  submitButtonText?: string;

  @IsOptional()
  @IsString()
  successMessage?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsString()
  emailPlaceholder?: string;

  @IsOptional()
  @IsString()
  privacyText?: string;

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
  @IsUUID()
  ogImageId?: string;

  @IsOptional()
  @IsObject()
  structuredData?: object;
}
