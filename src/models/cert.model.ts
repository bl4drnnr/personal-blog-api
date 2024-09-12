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
import { Author } from '@models/author.model';

interface CertCreationAttributes {
  certName: string;
  certDescription: string;
  certPicture: string;
  certDocs: string;
  obtainingDate: Date;
  obtainedSkills: Array<string>;
  authorId: string;
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

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_selected' })
  isSelected: boolean;

  @ForeignKey(() => Author)
  @Column({ type: DataType.UUID, allowNull: false, field: 'author_id' })
  authorId: string;

  @BelongsTo(() => Author)
  author: Author;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
