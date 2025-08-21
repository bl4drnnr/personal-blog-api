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

interface NotFoundPageCreationAttributes {
  title: string;
  content: string;
  heroImageMainId: string;
  heroImageMainAlt: string;
  heroTitle: string;
}

@Table({ tableName: 'not_found_page' })
export class NotFoundPage extends Model<
  NotFoundPage,
  NotFoundPageCreationAttributes
> {
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

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'hero_image_main_id'
  })
  heroImageMainId: string;

  @BelongsTo(() => StaticAssetModel, 'hero_image_main_id')
  heroImageMain: StaticAssetModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_image_main_alt'
  })
  heroImageMainAlt: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_title'
  })
  heroTitle: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
