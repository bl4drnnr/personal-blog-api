import {
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

interface MaintenanceModeCreationAttributes {
  isActive: boolean;
  message: string;
  fromDate: Date;
  toDate: Date;
  heroImageId: string;
  heroTitle: string;
  title: string;
  metaTitle: string;
}

@Table({ tableName: 'maintenance_mode' })
export class MaintenanceMode extends Model<
  MaintenanceMode,
  MaintenanceModeCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_active'
  })
  isActive: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'message'
  })
  message: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'from_date'
  })
  fromDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'to_date'
  })
  toDate: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'hero_image_id'
  })
  heroImageId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_title'
  })
  heroTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'meta_title'
  })
  metaTitle: string;
}
