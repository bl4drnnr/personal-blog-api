import { IsString, IsArray, IsBoolean, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  articleName: string;

  @IsString()
  articleDescription: string;

  @IsString()
  articleContent: string;

  @IsString()
  articleExcerpt: string;

  @IsUUID()
  articlePictureId: string;

  @IsArray()
  articleTags: Array<string>;

  @IsString()
  @IsNotEmpty()
  articleMetaKeywords: string;

  @IsBoolean()
  articlePublished: boolean;
}
