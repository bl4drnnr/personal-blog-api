import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Position } from '@models/position.model';
import { StaticAssetModel } from './static-asset.model';

interface ExperienceCreationAttributes {
  companyName: string;
  logoId: string;
  companyWebsite: string;
  order: number;
}

@Table({ tableName: 'experiences' })
export class Experience extends Model<Experience, ExperienceCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_name'
  })
  companyName: string;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'logo_id'
  })
  logoId: string;

  @BelongsTo(() => StaticAssetModel, 'logoId')
  logo: StaticAssetModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_website'
  })
  companyWebsite: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order'
  })
  order: number;

  @HasMany(() => Position)
  positions: Position[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
