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

interface CertificateCreationAttributes {
  name: string;
  issuedDate: string;
  expirationDate?: string;
  logoId?: string;
  description?: string;
  order?: number;
}

@Table({ tableName: 'certificates' })
export class Certificate extends Model<Certificate, CertificateCreationAttributes> {
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
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'issued_date'
  })
  issuedDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'expiration_date'
  })
  expirationDate: string;

  @ForeignKey(() => StaticAssetModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'logo_id'
  })
  logoId: string;

  @BelongsTo(() => StaticAssetModel, 'logo_id')
  logo: StaticAssetModel;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description'
  })
  description: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order'
  })
  order: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
