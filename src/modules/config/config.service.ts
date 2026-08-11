import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Database, DRIZZLE } from '@db/db.module';
import { siteConfig } from '@db/schema';
import { RevalidateService } from '@modules/revalidate/revalidate.service';
import { UpdateSiteConfigDto } from './dto/config.dto';

/**
 * The public config payload, spelled out so the maintenance flag stays off it:
 * /config feeds the admin settings form and the frontend cache, while the flag
 * is deploy state with its own endpoints and no caching.
 */
const PUBLIC_COLUMNS = {
  id: siteConfig.id,
  heroTitle: siteConfig.heroTitle,
  heroIntroMd: siteConfig.heroIntroMd,
  socialLinks: siteConfig.socialLinks,
  seoDefaultTitle: siteConfig.seoDefaultTitle,
  seoDefaultDescription: siteConfig.seoDefaultDescription,
  footerText: siteConfig.footerText,
  updatedAt: siteConfig.updatedAt,
};

@Injectable()
export class SiteConfigService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly revalidate: RevalidateService,
  ) {}

  async get() {
    const [row] = await this.db.select(PUBLIC_COLUMNS).from(siteConfig).where(eq(siteConfig.id, 1));
    if (!row) {
      throw new InternalServerErrorException('site_config singleton row is missing');
    }
    return row;
  }

  async update(dto: UpdateSiteConfigDto) {
    const [updated] = await this.db
      .update(siteConfig)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(siteConfig.id, 1))
      .returning(PUBLIC_COLUMNS);
    this.revalidate.notify(['config']);
    return updated;
  }

  async getMaintenance() {
    const [row] = await this.db
      .select({ enabled: siteConfig.maintenance })
      .from(siteConfig)
      .where(eq(siteConfig.id, 1));
    if (!row) {
      throw new InternalServerErrorException('site_config singleton row is missing');
    }
    return row;
  }

  /**
   * Flips the switch without touching updatedAt (it tracks content edits) and
   * without revalidation — the frontend middleware reads the flag uncached.
   */
  async setMaintenance(enabled: boolean) {
    const [row] = await this.db
      .update(siteConfig)
      .set({ maintenance: enabled })
      .where(eq(siteConfig.id, 1))
      .returning({ enabled: siteConfig.maintenance });
    return row;
  }
}
