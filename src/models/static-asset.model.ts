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

interface StaticAssetCreationAttributes {
  name: string;
  s3Url: string;
  description: string;
}

@Table({ tableName: 'static_assets' })
export class StaticAssetModel extends Model<
  StaticAssetModel,
  StaticAssetCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'name'
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 's3_url'
  })
  s3Url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description'
  })
  description: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
