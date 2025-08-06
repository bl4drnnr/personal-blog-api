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

interface SubscribePageCreationAttributes {
  title?: string;
  subtitle?: string;
  description?: string;
  footerText?: string;
  heroImageMainId?: string;
  heroImageSecondaryId?: string;
  heroImageMainAlt?: string;
  heroImageSecondaryAlt?: string;
  logoText?: string;
  breadcrumbText?: string;
  heroTitle?: string;
  heroDesc?: string;
  carouselWords?: string;
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  emailPlaceholder?: string;
  privacyText?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: string;
  structuredData?: object;
}

@Table({ tableName: 'subscribe_page' })
export class SubscribePage extends Model<
  SubscribePage,
  SubscribePageCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'subtitle'
  })
  subtitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'footer_text'
  })
  footerText: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'hero_image_main_id'
  })
  heroImageMainId: string;

  @Column({
    type: DataType.UUID,
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
    type: DataType.TEXT,
    allowNull: true,
    field: 'hero_desc'
  })
  heroDesc: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'carousel_words'
  })
  carouselWords: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'submit_button_text'
  })
  submitButtonText: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'success_message'
  })
  successMessage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'error_message'
  })
  errorMessage: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'email_placeholder'
  })
  emailPlaceholder: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'privacy_text'
  })
  privacyText: string;

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
    type: DataType.UUID,
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
