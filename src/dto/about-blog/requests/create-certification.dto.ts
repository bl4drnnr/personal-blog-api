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

export class CreateCertificationDto {
  @IsString({ message: ValidationError.WRONG_CERT_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_NAME_LENGTH })
  certName: string;

  @IsString({ message: ValidationError.WRONG_CERT_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_DESC_LENGTH })
  certDescription: string;

  @Matches(ImageRegex, {
    message: ValidationError.WRONG_IMAGE_FORMAT
  })
  certPicture: string;

  @Matches(PdfRegex, {
    message: ValidationError.WRONG_PDF_NAME_FORMAT
  })
  certDocs: string;

  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  obtainingDate: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  expirationDate?: Date;

  @IsArray()
  @ArrayMinSize(1)
  obtainedSkills: Array<string>;

  @IsUUID('4', { message: ValidationError.WRONG_AUTHOR_ID_FORMAT })
  authorId: string;
}
