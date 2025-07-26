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

interface ProjectsPageCreationAttributes {
  title?: string;
  subtitle?: string;
  description?: string;
  footerText?: string;
  heroImageMain?: string;
  heroImageSecondary?: string;
  heroImageMainAlt?: string;
  heroImageSecondaryAlt?: string;
  logoText?: string;
  breadcrumbText?: string;
  heroTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: object;
}

@Table({ tableName: 'projects_page' })
export class ProjectsPage extends Model<
  ProjectsPage,
  ProjectsPageCreationAttributes
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
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_image_main'
  })
  heroImageMain: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'hero_image_secondary'
  })
  heroImageSecondary: string;

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
    field: 'og_image'
  })
  ogImage: string;

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
