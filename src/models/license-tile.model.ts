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
import { LicensePage } from './license-page.model';

interface LicenseTileCreationAttributes {
  licensePageId: string;
  title: string;
  description: string;
  links: Array<{
    label: string;
    url: string;
  }>;
  sortOrder: number;
}

@Table({ tableName: 'license_tiles' })
export class LicenseTile extends Model<LicenseTile, LicenseTileCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => LicensePage)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'license_page_id'
  })
  licensePageId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'links'
  })
  links: Array<{
    label: string;
    url: string;
  }>;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @BelongsTo(() => LicensePage)
  licensePage: LicensePage;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
