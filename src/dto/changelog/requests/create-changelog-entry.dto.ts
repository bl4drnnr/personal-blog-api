import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateChangelogEntryDto {
  @IsString()
  version: string;

  @IsString()
  date: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  changes: string[];

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
