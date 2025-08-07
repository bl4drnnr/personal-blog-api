import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { ContactPage } from './contact-page.model';
import { StaticAssetModel } from '@models/static-asset.model';

interface ContactTileCreationAttributes {
  title: string;
  content: string;
  link: string;
  iconAssetId: string;
  sortOrder: number;
  contactPageId: string;
}

@Table({ tableName: 'contact_tiles' })
export class ContactTile extends Model<ContactTile, ContactTileCreationAttributes> {
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
    field: 'content'
  })
  content: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'link'
  })
  link: string;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'icon_asset_id'
  })
  iconAssetId: string;

  @BelongsTo(() => StaticAssetModel)
  iconAsset: StaticAssetModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @ForeignKey(() => ContactPage)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'contact_page_id'
  })
  contactPageId: string;

  @BelongsTo(() => ContactPage)
  contactPage: ContactPage;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
