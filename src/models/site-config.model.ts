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

interface SiteConfigCreationAttributes {
  siteName: string;
  siteDescription: string;
  siteAuthor: string;
  siteUrl: string;
  defaultImage: string;
  keywords: string;
  socialMedia: object;
  organization: object;
}

@Table({ tableName: 'site_config' })
export class SiteConfigModel extends Model<
  SiteConfigModel,
  SiteConfigCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'site_name'
  })
  siteName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'site_description'
  })
  siteDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'site_author'
  })
  siteAuthor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'site_url'
  })
  siteUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'default_image'
  })
  defaultImage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'keywords'
  })
  keywords: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'social_media'
  })
  socialMedia: object;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'organization'
  })
  organization: object;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
