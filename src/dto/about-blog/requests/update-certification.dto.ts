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
import { LinkRegex } from '@regex/link.regex';

export class UpdateCertificationDto {
  @IsUUID('4', { message: ValidationError.WRONG_CERTIFICATION_ID_FORMAT })
  certificationId: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_CERT_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_NAME_LENGTH })
  certName?: string;

  @IsOptional()
  @IsString({ message: ValidationError.WRONG_CERT_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_CERT_DESC_LENGTH })
  certDescription?: string;

  @IsOptional()
  @Matches(ImageRegex, { message: ValidationError.WRONG_IMAGE_FORMAT })
  certPicture?: string;

  @IsOptional()
  @Matches(LinkRegex, { message: ValidationError.WRONG_LINK_FORMAT })
  certDocs?: string;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  obtainingDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: ValidationError.WRONG_DATE_FORMAT })
  expirationDate?: Date;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  obtainedSkills?: Array<string>;
}
