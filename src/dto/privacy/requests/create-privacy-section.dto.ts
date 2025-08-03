import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePrivacySectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
