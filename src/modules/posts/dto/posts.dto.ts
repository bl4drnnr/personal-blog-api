import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const PER_PAGE_OPTIONS = [10, 25, 50] as const;

export class ListPostsQueryDto {
  @IsOptional()
  @IsIn(['article', 'project'])
  type?: 'article' | 'project';

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsIn(PER_PAGE_OPTIONS as unknown as number[])
  per: number = 10;
}

export class AdminListPostsQueryDto {
  @IsOptional()
  @IsIn(['article', 'project'])
  type?: 'article' | 'project';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsIn(PER_PAGE_OPTIONS as unknown as number[])
  per: number = 25;
}

export class CreatePostDto {
  @IsIn(['article', 'project'])
  type: 'article' | 'project';

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with single hyphens',
  })
  @MaxLength(120)
  slug: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(500)
  excerpt: string;

  @IsString()
  contentMd: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags: string[];

  @IsBoolean()
  featured: boolean;

  @IsBoolean()
  published: boolean;

  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @IsOptional()
  @IsUUID()
  heroAssetId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoDescription?: string;
}

export class UpdatePostDto extends CreatePostDto {}
