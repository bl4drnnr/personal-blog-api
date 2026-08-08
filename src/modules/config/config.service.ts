import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Database, DRIZZLE } from '@db/db.module';
import { siteConfig } from '@db/schema';
import { RevalidateService } from '@modules/revalidate/revalidate.service';
import { UpdateSiteConfigDto } from './dto/config.dto';

@Injectable()
export class SiteConfigService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly revalidate: RevalidateService,
  ) {}

  async get() {
    const [row] = await this.db.select().from(siteConfig).where(eq(siteConfig.id, 1));
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
      .returning();
    this.revalidate.notify(['config']);
    return updated;
  }
}
