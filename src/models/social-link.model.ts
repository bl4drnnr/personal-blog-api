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
import { StaticAssetModel } from './static-asset.model';

interface SocialLinkCreationAttributes {
  url: string;
  alt: string;
  iconId: string;
}

@Table({ tableName: 'social_links' })
export class SocialLinkModel extends Model<
  SocialLinkModel,
  SocialLinkCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'url'
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'alt'
  })
  alt: string;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'icon_id'
  })
  iconId: string;

  @BelongsTo(() => StaticAssetModel)
  icon: StaticAssetModel;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
