import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';

interface AboutPageCreationAttributes {
  title: string;
  content: string;
  footerText?: string;
  heroImageMainId?: string;
  heroImageSecondaryId?: string;
  heroImageMainAlt?: string;
  heroImageSecondaryAlt?: string;
  logoText?: string;
  breadcrumbText?: string;
  heroTitle?: string;
  contactTiles?: object;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: string;
  structuredData?: object;
}

@Table({ tableName: 'about_page' })
export class AboutPage extends Model<AboutPage, AboutPageCreationAttributes> {
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
    type: DataType.TEXT,
    allowNull: false,
    field: 'content'
  })
  content: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'footer_text'
  })
  footerText: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_image_main_id'
  })
  heroImageMainId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_image_secondary_id'
  })
  heroImageSecondaryId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_image_main_alt'
  })
  heroImageMainAlt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_image_secondary_alt'
  })
  heroImageSecondaryAlt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'logo_text'
  })
  logoText: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'breadcrumb_text'
  })
  breadcrumbText: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_title'
  })
  heroTitle: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'contact_tiles'
  })
  contactTiles: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meta_title'
  })
  metaTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'meta_description'
  })
  metaDescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'meta_keywords'
  })
  metaKeywords: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'og_title'
  })
  ogTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'og_description'
  })
  ogDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'og_image_id'
  })
  ogImageId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'structured_data'
  })
  structuredData: object;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
