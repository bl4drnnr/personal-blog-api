import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max
} from 'class-validator';

export class UpdatePasswordProtectionModeDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(168) // Max 1 week
  durationHours?: number;

  @IsOptional()
  @IsString()
  heroImageId?: string;

  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsString()
  footerText?: string;
}
