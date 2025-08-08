import { IsString, IsArray, IsBoolean, IsUUID } from 'class-validator';

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

  @IsBoolean()
  articlePublished: boolean;
}
