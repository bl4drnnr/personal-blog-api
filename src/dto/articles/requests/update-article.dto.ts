import { IsString, IsArray, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsNotEmpty()
  @IsOptional()
  articleMetaKeywords: string;

  @IsString()
  @IsUUID()
  articlePictureId: string;
}
