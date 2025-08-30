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
import { User } from '@models/user.model';

interface PasswordProtectionModeCreationAttributes {
  isActive: boolean;
  password: string;
  durationHours: number;
  heroImageId: string;
  heroTitle: string;
  metaTitle: string;
  userId: string;
}

@Table({ tableName: 'password_protection_mode' })
export class PasswordProtectionMode extends Model<
  PasswordProtectionMode,
  PasswordProtectionModeCreationAttributes
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
    type: DataType.STRING,
    allowNull: false,
    field: 'password'
  })
  password: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 24,
    field: 'duration_hours'
  })
  durationHours: number;

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

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => StaticAssetModel, 'hero_image_id')
  heroImage: StaticAssetModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hero_title'
  })
  heroTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'meta_title'
  })
  metaTitle: string;
}
