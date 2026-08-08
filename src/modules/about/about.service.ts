import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { asc, desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { Database, DRIZZLE } from '../../db/db.module';
import { about, assets, certifications, education, positions } from '../../db/schema';
import { RevalidateService } from '../revalidate/revalidate.service';
import { CertificationDto, EducationDto, PositionDto, UpdateAboutDto } from './dto/about.dto';

type CvTable = typeof positions | typeof education | typeof certifications;

@Injectable()
export class AboutService {
  private readonly publicUrl: string;

  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly revalidate: RevalidateService,
    config: ConfigService,
  ) {
    this.publicUrl = config.getOrThrow<string>('S3_PUBLIC_URL');
  }

  private url(s3Key: string | null): string | null {
    return s3Key ? `${this.publicUrl}/${s3Key}` : null;
  }

  async getPublic() {
    const avatarAssets = alias(assets, 'avatar_assets');
    const [aboutRow] = await this.db
      .select({
        fullName: about.fullName,
        profileMd: about.profileMd,
        location: about.location,
        contactEmail: about.contactEmail,
        seoTitle: about.seoTitle,
        seoDescription: about.seoDescription,
        avatarKey: avatarAssets.s3Key,
      })
      .from(about)
      .leftJoin(avatarAssets, eq(about.avatarAssetId, avatarAssets.id))
      .where(eq(about.id, 1));
    if (!aboutRow) {
      throw new InternalServerErrorException('about singleton row is missing');
    }

    const positionRows = await this.db
      .select({ row: positions, logoKey: assets.s3Key })
      .from(positions)
      .leftJoin(assets, eq(positions.logoAssetId, assets.id))
      .orderBy(asc(positions.sortOrder), desc(positions.startDate));

    const educationRows = await this.db
      .select({ row: education, logoKey: assets.s3Key })
      .from(education)
      .leftJoin(assets, eq(education.logoAssetId, assets.id))
      .orderBy(asc(education.sortOrder), desc(education.startDate));

    const certificationRows = await this.db
      .select({ row: certifications, logoKey: assets.s3Key })
      .from(certifications)
      .leftJoin(assets, eq(certifications.logoAssetId, assets.id))
      .orderBy(asc(certifications.sortOrder), desc(certifications.issuedDate));

    const { avatarKey, ...aboutData } = aboutRow;
    const strip = <T extends { row: Record<string, unknown>; logoKey: string | null }>(
      items: T[],
    ) =>
      items.map(({ row, logoKey }) => {
        const { logoAssetId: _logoAssetId, ...rest } = row;
        return { ...rest, logoUrl: this.url(logoKey) };
      });

    return {
      ...aboutData,
      avatarUrl: this.url(avatarKey),
      positions: strip(positionRows),
      education: strip(educationRows),
      certifications: strip(certificationRows),
    };
  }

  // --- admin ----------------------------------------------------------------

  async getAdmin() {
    const [aboutRow] = await this.db.select().from(about).where(eq(about.id, 1));
    if (!aboutRow) {
      throw new InternalServerErrorException('about singleton row is missing');
    }
    return {
      about: aboutRow,
      positions: await this.db
        .select()
        .from(positions)
        .orderBy(asc(positions.sortOrder), desc(positions.startDate)),
      education: await this.db
        .select()
        .from(education)
        .orderBy(asc(education.sortOrder), desc(education.startDate)),
      certifications: await this.db
        .select()
        .from(certifications)
        .orderBy(asc(certifications.sortOrder), desc(certifications.issuedDate)),
    };
  }

  async updateAbout(dto: UpdateAboutDto) {
    const [updated] = await this.db
      .update(about)
      .set({
        ...dto,
        avatarAssetId: dto.avatarAssetId ?? null,
        seoTitle: dto.seoTitle ?? null,
        seoDescription: dto.seoDescription ?? null,
        updatedAt: new Date(),
      })
      .where(eq(about.id, 1))
      .returning();
    this.revalidate.notify(['about']);
    return updated;
  }

  async createEntry(table: CvTable, dto: PositionDto | EducationDto | CertificationDto) {
    const [created] = await this.db.insert(table).values(this.normalize(dto)).returning();
    this.revalidate.notify(['about']);
    return created;
  }

  async updateEntry(
    table: CvTable,
    id: string,
    dto: PositionDto | EducationDto | CertificationDto,
  ) {
    const [updated] = await this.db
      .update(table)
      .set(this.normalize(dto))
      .where(eq(table.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException();
    }
    this.revalidate.notify(['about']);
    return updated;
  }

  async removeEntry(table: CvTable, id: string) {
    const [deleted] = await this.db.delete(table).where(eq(table.id, id)).returning();
    if (!deleted) {
      throw new NotFoundException();
    }
    this.revalidate.notify(['about']);
  }

  /** Optional fields absent from the payload are cleared, not preserved. */
  private normalize(dto: PositionDto | EducationDto | CertificationDto) {
    return {
      ...dto,
      logoAssetId: dto.logoAssetId ?? null,
      ...('endDate' in dto ? { endDate: dto.endDate ?? null } : {}),
      ...('companyUrl' in dto ? { companyUrl: dto.companyUrl ?? null } : {}),
      ...('expiresDate' in dto ? { expiresDate: dto.expiresDate ?? null } : {}),
      ...('credentialUrl' in dto ? { credentialUrl: dto.credentialUrl ?? null } : {}),
    };
  }
}
