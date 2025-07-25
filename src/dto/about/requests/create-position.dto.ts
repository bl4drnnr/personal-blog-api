import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  title: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsNumber()
  order?: number;
}
