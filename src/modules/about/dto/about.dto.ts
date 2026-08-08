import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsString()
  profileMd: string;

  @IsString()
  @MaxLength(100)
  location: string;

  @IsString()
  @MaxLength(200)
  contactEmail: string;

  @IsOptional()
  @IsUUID()
  avatarAssetId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoDescription?: string;
}

export class PositionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  company: string;

  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title: string;

  @IsString()
  @MaxLength(300)
  description: string;

  @IsString()
  @MaxLength(100)
  location: string;

  @IsOptional()
  @IsUUID()
  logoAssetId?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  bullets: string[];

  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  skills: string[];

  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class EducationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  institution: string;

  @IsString()
  @MinLength(1)
  @MaxLength(150)
  degree: string;

  @IsString()
  @MaxLength(150)
  field: string;

  @IsString()
  @MaxLength(100)
  location: string;

  @IsOptional()
  @IsUUID()
  logoAssetId?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  @MaxLength(500)
  notes: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class CertificationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(150)
  issuer: string;

  @IsString()
  @MaxLength(400)
  description: string;

  @IsOptional()
  @IsUUID()
  logoAssetId?: string;

  @IsDateString()
  issuedDate: string;

  @IsOptional()
  @IsDateString()
  expiresDate?: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}
