import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { eq } from 'drizzle-orm';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { Database, DRIZZLE } from '../../db/db.module';
import { siteConfig } from '../../db/schema';
import { RevalidateService } from '../revalidate/revalidate.service';

class SocialLinkDto {
  @IsString()
  @MaxLength(50)
  label: string;

  @IsUrl()
  url: string;
}

class UpdateSiteConfigDto {
  @IsString()
  @MaxLength(300)
  heroTitle: string;

  @IsString()
  heroIntroMd: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks: SocialLinkDto[];

  @IsString()
  @MaxLength(200)
  seoDefaultTitle: string;

  @IsString()
  @MaxLength(300)
  seoDefaultDescription: string;

  @IsString()
  @MaxLength(200)
  footerText: string;
}

@Controller()
export class SiteConfigController {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly revalidate: RevalidateService,
  ) {}

  @Get('config')
  async get() {
    const [row] = await this.db.select().from(siteConfig).where(eq(siteConfig.id, 1));
    if (!row) {
      throw new InternalServerErrorException('site_config singleton row is missing');
    }
    return row;
  }

  @Put('admin/config')
  @UseGuards(AccessTokenGuard)
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
