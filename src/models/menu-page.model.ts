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
import { MenuTile } from './menu-tile.model';

interface MenuPageCreationAttributes {
  heroImageMainId: string;
  heroImageMainAlt: string;
  logoText: string;
  breadcrumbText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;
  structuredData: object;
}

@Table({ tableName: 'menu_page' })
export class MenuPage extends Model<MenuPage, MenuPageCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_image_main_id'
  })
  heroImageMainId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_image_main_alt'
  })
  heroImageMainAlt: string;

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
    type: DataType.STRING,
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

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @HasMany(() => MenuTile)
  menuTiles: MenuTile[];
}
