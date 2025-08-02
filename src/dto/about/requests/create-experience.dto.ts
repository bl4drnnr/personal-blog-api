import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePositionDto } from './create-position.dto';

export class CreateExperienceDto {
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  logoId?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePositionDto)
  positions?: CreatePositionDto[];
}
