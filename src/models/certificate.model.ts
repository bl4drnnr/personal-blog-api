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

interface CertificateCreationAttributes {
  name: string;
  issuedDate: string;
  expirationDate?: string;
  logo?: string;
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'logo'
  })
  logo: string;

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
