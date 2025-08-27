import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { LicenseTile } from './license-tile.model';

interface LicensePageCreationAttributes {
  title: string;
  licenseDate: string;
  paragraphs: string[];
  additionalInfoTitle: string;
  additionalInfoParagraphs: string[];
  heroImageMainId: string;
  heroImageSecondaryId: string;
  heroImageMainAlt: string;
  heroImageSecondaryAlt: string;
  logoText: string;
  breadcrumbText: string;
  heroTitle: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;
  structuredData: object;
}

@Table({ tableName: 'license_page' })
export class LicensePage extends Model<LicensePage, LicensePageCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'license_date'
  })
  licenseDate: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'paragraphs'
  })
  paragraphs: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'additional_info_title'
  })
  additionalInfoTitle: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'additional_info_paragraphs'
  })
  additionalInfoParagraphs: string[];

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'hero_image_main_id'
  })
  heroImageMainId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'hero_image_secondary_id'
  })
  heroImageSecondaryId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_image_main_alt'
  })
  heroImageMainAlt: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_image_secondary_alt'
  })
  heroImageSecondaryAlt: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'logo_text'
  })
  logoText: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'breadcrumb_text'
  })
  breadcrumbText: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_title'
  })
  heroTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'meta_title'
  })
  metaTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'meta_description'
  })
  metaDescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'meta_keywords'
  })
  metaKeywords: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'og_title'
  })
  ogTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'og_description'
  })
  ogDescription: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'og_image_id'
  })
  ogImageId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'structured_data'
  })
  structuredData: object;

  @HasMany(() => LicenseTile)
  licenseTiles: LicenseTile[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
