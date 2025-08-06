import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { ChangelogEntry } from './changelog-entry.model';
import { StaticAssetModel } from './static-asset.model';

interface ChangelogPageCreationAttributes {
  footerText: string;
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

@Table({ tableName: 'changelog_page' })
export class ChangelogPage extends Model<
  ChangelogPage,
  ChangelogPageCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'footer_text'
  })
  footerText: string;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'hero_image_main_id'
  })
  heroImageMainId: string;

  @BelongsTo(() => StaticAssetModel, 'hero_image_main_id')
  heroImageMain: StaticAssetModel;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'hero_image_secondary_id'
  })
  heroImageSecondaryId: string;

  @BelongsTo(() => StaticAssetModel, 'hero_image_secondary_id')
  heroImageSecondary: StaticAssetModel;

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

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'og_image_id'
  })
  ogImageId: string;

  @BelongsTo(() => StaticAssetModel, 'og_image_id')
  ogImage: StaticAssetModel;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'structured_data'
  })
  structuredData: object;

  @HasMany(() => ChangelogEntry)
  entries: ChangelogEntry[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
