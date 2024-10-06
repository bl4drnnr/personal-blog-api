import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateNested
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';
import { PdfRegex } from '@regex/pdf.regex';
import { Type } from 'class-transformer';
import { Language } from '@interfaces/language.enum';

class CertificationDto {
  @IsString({ message: ValidationError.WRONG_CERT_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_NAME_LENGTH })
  readonly certName: string;

  @IsString({ message: ValidationError.WRONG_CERT_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_DESC_LENGTH })
  readonly certDescription: string;

  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly certPicture: string;

  @Matches(PdfRegex, {
    message: ValidationError.WRONG_PDF_NAME_FORMAT
  })
  readonly certDocs: string;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly obtainingDate: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly expirationDate?: Date;

  @IsArray()
  @ArrayMinSize(1, { message: ValidationError.WRONG_OBTAINED_SKILLS_LENGTH })
  readonly obtainedSkills: Array<string>;

  @IsEnum(Language)
  readonly certLanguage: Language;

  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  readonly authorId: string;
}

export class CreateCertificationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3, { message: ValidationError.WRONG_CERTIFICATIONS_LENGTH })
  @ArrayMaxSize(3, { message: ValidationError.WRONG_CERTIFICATIONS_LENGTH })
  @Type(() => CertificationDto)
  readonly certifications: Array<CertificationDto>;
}
