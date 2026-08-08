import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { eq } from 'drizzle-orm';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { Database, DRIZZLE } from '@db/db.module';
import { siteConfig } from '@db/schema';
import { RevalidateService } from '@modules/revalidate/revalidate.service';

class SocialLinkDto {
  @ApiProperty({ example: 'github' })
  @IsString()
  @MaxLength(50)
  label: string;

  @ApiProperty({ example: 'https://github.com/bl4drnnr' })
  @IsUrl()
  url: string;
}

class UpdateSiteConfigDto {
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

@ApiTags('Config')
@Controller()
export class SiteConfigController {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly revalidate: RevalidateService,
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Public site configuration' })
  @ApiOkResponse({ description: 'Hero, intro, social links, SEO defaults, footer.' })
  async get() {
    const [row] = await this.db.select().from(siteConfig).where(eq(siteConfig.id, 1));
    if (!row) {
      throw new InternalServerErrorException('site_config singleton row is missing');
    }
    return row;
  }

  @Put('admin/config')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[admin] Update site configuration' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  async update(@Body() dto: UpdateSiteConfigDto) {
    const [updated] = await this.db
      .update(siteConfig)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(siteConfig.id, 1))
      .returning();
    this.revalidate.notify(['config']);
    return updated;
  }
}
