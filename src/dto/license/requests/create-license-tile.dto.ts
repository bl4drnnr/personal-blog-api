import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class LicenseLink {
  @IsString()
  label: string;

  @IsString()
  url: string;
}

export class CreateLicenseTileDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicenseLink)
  links: LicenseLink[];

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
