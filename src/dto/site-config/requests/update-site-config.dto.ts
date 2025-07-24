import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateSiteConfigDto {
  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsString()
  siteDescription?: string;

  @IsOptional()
  @IsString()
  siteAuthor?: string;

  @IsOptional()
  @IsString()
  siteUrl?: string;

  @IsOptional()
  @IsString()
  defaultImage?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsObject()
  socialMedia?: object;

  @IsOptional()
  @IsObject()
  organization?: object;
}
