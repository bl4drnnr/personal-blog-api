import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { MenuPage } from './menu-page.model';

export interface MenuTileCreationAttributes {
  title: string;
  link: string;
  iconId: string;
  iconAlt: string;
  imageId: string;
  imageAlt: string;
  sortOrder: number;
  menuPageId: string;
}

@Table({ tableName: 'menu_tiles' })
export class MenuTile extends Model<MenuTile, MenuTileCreationAttributes> {
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
    field: 'link'
  })
  link: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'icon_id'
  })
  iconId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'icon_alt'
  })
  iconAlt: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'image_id'
  })
  imageId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'image_alt'
  })
  imageAlt: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @ForeignKey(() => MenuPage)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'menu_page_id'
  })
  menuPageId: string;

  @BelongsTo(() => MenuPage)
  menuPage: MenuPage;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
