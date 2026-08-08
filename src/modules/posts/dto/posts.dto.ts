import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ enum: ['article', 'project'] })
  @IsOptional()
  @IsIn(['article', 'project'])
  type?: 'article' | 'project';

  @ApiPropertyOptional({ description: 'Only featured posts', type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ enum: PER_PAGE_OPTIONS, default: 10 })
  @Type(() => Number)
  @IsIn(PER_PAGE_OPTIONS as unknown as number[])
  per: number = 10;
}

export class AdminListPostsQueryDto {
  @ApiPropertyOptional({ enum: ['article', 'project'] })
  @IsOptional()
  @IsIn(['article', 'project'])
  type?: 'article' | 'project';

  @ApiPropertyOptional({ description: 'Case-insensitive title match' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ enum: PER_PAGE_OPTIONS, default: 25 })
  @Type(() => Number)
  @IsIn(PER_PAGE_OPTIONS as unknown as number[])
  per: number = 25;
}

export class CreatePostDto {
  @ApiProperty({ enum: ['article', 'project'] })
  @IsIn(['article', 'project'])
  type: 'article' | 'project';

  @ApiProperty({
    description: 'Lowercase, hyphen-separated URL slug',
    example: 'notes-on-ebpf-based-runtime-detection',
  })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with single hyphens',
  })
  @MaxLength(120)
  slug: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Short summary shown on cards and as meta description',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  excerpt: string;

  @ApiProperty({ description: 'Markdown body' })
  @IsString()
  contentMd: string;

  @ApiProperty({ type: [String], example: ['detection', 'ebpf'] })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags: string[];

  @ApiProperty({ description: 'Show on the home page' })
  @IsBoolean()
  featured: boolean;

  @ApiProperty({ description: 'Publish immediately (first publish stamps publishedAt)' })
  @IsBoolean()
  published: boolean;

  @ApiPropertyOptional({ description: 'Repository URL (projects)' })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @ApiPropertyOptional({ description: 'Hero image asset id', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  heroAssetId?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoDescription?: string;
}

export class UpdatePostDto extends CreatePostDto {}
