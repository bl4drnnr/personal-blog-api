import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CopyrightLinkDto {
  @IsString()
  title: string;

  @IsString()
  link: string;
}

export class UpdateCopyrightDataDto {
  @IsOptional()
  @IsString()
  copyrightEmail?: string;

  @IsOptional()
  @IsString()
  copyrightText?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CopyrightLinkDto)
  copyrightLinks?: CopyrightLinkDto[];
}
