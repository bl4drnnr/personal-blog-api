import { Section } from '@interfaces/section.interface';
import { ArrayMinSize, IsArray, IsString, MinLength } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class CreatePostDto {
  @IsString({ message: ValidationError.WRONG_POST_NAME_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_POST_NAME_LENGTH })
  readonly postName: string;

  @IsString({ message: ValidationError.WRONG_POST_DESC_FORMAT })
  @MinLength(1, { message: ValidationError.WRONG_POST_DESC_LENGTH })
  readonly postDescription: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly postTags: Array<string>;

  @IsArray()
  @ArrayMinSize(1)
  readonly sections: Array<Section>;
}
