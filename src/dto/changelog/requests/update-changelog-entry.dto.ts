import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateChangelogEntryDto {
  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changes?: string[];

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
