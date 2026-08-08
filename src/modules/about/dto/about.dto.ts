import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ description: 'Markdown bio' })
  @IsString()
  profileMd: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  location: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  contactEmail: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  avatarAssetId?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoDescription?: string;
}

export class PositionDto {
  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  company: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @ApiProperty({ description: 'Role title', maxLength: 150 })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title: string;

  @ApiProperty({ description: 'One-line blurb', maxLength: 300 })
  @IsString()
  @MaxLength(300)
  description: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  location: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  logoAssetId?: string;

  @ApiProperty({ format: 'date', example: '2024-07-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ format: 'date', description: 'Omit for a current role' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  bullets: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  skills: string[];

  @ApiProperty({ description: 'Display order (ascending)', minimum: 0 })
  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class EducationDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  institution: string;

  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  degree: string;

  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MaxLength(150)
  field: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  location: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  logoAssetId?: string;

  @ApiProperty({ format: 'date', example: '2019-10-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Thesis or note', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  notes: string;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class CertificationDto {
  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MaxLength(150)
  issuer: string;

  @ApiProperty({ maxLength: 400 })
  @IsString()
  @MaxLength(400)
  description: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  logoAssetId?: string;

  @ApiProperty({ format: 'date', example: '2024-03-01' })
  @IsDateString()
  issuedDate: string;

  @ApiPropertyOptional({ format: 'date', description: 'Omit if the credential does not expire' })
  @IsOptional()
  @IsDateString()
  expiresDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  sortOrder: number;
}
