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

interface SocialCreationAttributes {
  link: string;
  title: string;
  authorId: string;
}

@Table({ tableName: 'socials' })
export class Social extends Model<Social, SocialCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  link: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => Author)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'author_id'
  })
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
