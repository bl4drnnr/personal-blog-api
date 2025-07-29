import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreatePrivacySectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsIn(['main', 'cookie_policy'])
  sectionType?: 'main' | 'cookie_policy';
}
