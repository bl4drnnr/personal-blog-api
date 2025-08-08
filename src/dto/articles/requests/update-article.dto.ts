import { IsString, IsArray, IsUUID } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsUUID()
  articleId: string;

  @IsString()
  articleName: string;

  @IsString()
  articleDescription: string;

  @IsString()
  articleContent: string;

  @IsArray()
  articleTags: Array<string>;

  @IsString()
  @IsUUID()
  articlePictureId: string;
}
