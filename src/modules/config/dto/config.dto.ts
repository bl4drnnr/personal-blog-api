import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';

export class SocialLinkDto {
  @ApiProperty({ example: 'github' })
  @IsString()
  @MaxLength(50)
  label: string;

  @ApiProperty({ example: 'https://github.com/mikhailbahdashych' })
  @IsUrl()
  url: string;
}

export class UpdateSiteConfigDto {
  @ApiProperty({ maxLength: 300 })
  @IsString()
  @MaxLength(300)
  heroTitle: string;

  @ApiProperty({ description: 'Markdown intro under the hero' })
  @IsString()
  heroIntroMd: string;

  @ApiProperty({ type: [SocialLinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks: SocialLinkDto[];

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  seoDefaultTitle: string;

  @ApiProperty({ maxLength: 300 })
  @IsString()
  @MaxLength(300)
  seoDefaultDescription: string;

  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  footerText: string;
}
