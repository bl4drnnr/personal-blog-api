import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ImageRegex } from '@regex/image.regex';
import { PdfRegex } from '@regex/pdf.regex';

export class UpdateCertificationDto {
  @IsUUID('4', {
    message: ValidationError.WRONG_CERTIFICATION_ID_FORMAT
  })
  readonly certificationId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_CERT_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_NAME_LENGTH })
  readonly certName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_CERT_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_DESC_LENGTH })
  readonly certDescription?: string;

  @IsOptional()
  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  readonly certPicture?: string;

  @IsOptional()
  @Matches(PdfRegex, {
    message: ValidationError.WRONG_PDF_NAME_FORMAT
  })
  readonly certDocs?: string;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly obtainingDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  readonly expirationDate?: Date;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  readonly obtainedSkills?: Array<string>;
}
