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
import { User } from '@models/user.model';

interface CertCreationAttributes {
  certName: string;
  certDescription: string;
  certPicture: string;
  certDocs: string;
  obtainingDate: Date;
  obtainedSkills: Array<string>;
  userId: string;
}

@Table({ tableName: 'certificates' })
export class Cert extends Model<Cert, CertCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'cert_name' })
  certName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'cert_description'
  })
  certDescription: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'cert_picture' })
  certPicture: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'cert_docs' })
  certDocs: string;

  @Column({ type: DataType.DATE, allowNull: false, field: 'obtaining_date' })
  obtainingDate: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'expiration_date' })
  expirationDate: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'obtained_skills'
  })
  obtainedSkills: Array<string>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
