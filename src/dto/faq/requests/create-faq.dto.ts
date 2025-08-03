import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  question: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  answer: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
