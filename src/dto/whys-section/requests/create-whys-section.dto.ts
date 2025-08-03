import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';

class WhyBlockDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text: string;
}

class FeatureItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;
}

export class CreateWhysSectionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhyBlockDto)
  whyBlocks: WhyBlockDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureItemDto)
  features: FeatureItemDto[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
