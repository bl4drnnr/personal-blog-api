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
import { User } from '@models/user.model';
import { Social } from '@models/social.model';

interface AuthorCreationAttributes {
  firstName: string;
  lastName: string;
  description: string;
  profilePicture: string;
  userId: string;
}

@Table({ tableName: 'authors' })
export class Author extends Model<Author, AuthorCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'first_name' })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'last_name' })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'profile_picture' })
  profilePicture: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_selected' })
  isSelected: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Social)
  socials: Array<Social>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
