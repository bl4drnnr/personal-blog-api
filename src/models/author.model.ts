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
import { Experience } from '@models/experience.model';
import { Cert } from '@models/cert.model';
import { Language } from '@interfaces/language.enum';

const languageTypes = [Language.PL, Language.EN, Language.RU];

interface AuthorCreationAttributes {
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  profilePicture: string;
  authorLanguage: Language;
  userId: string;
}

@Table({ tableName: 'authors' })
export class Author extends Model<Author, AuthorCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name'
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name'
  })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'profile_picture'
  })
  profilePicture: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_selected'
  })
  isSelected: boolean;

  @Column({
    type: DataType.ENUM(...languageTypes),
    allowNull: false,
    field: 'author_language'
  })
  authorLanguage: Language;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Social)
  socials: Array<Social>;

  @HasMany(() => Experience)
  experiences: Array<Experience>;

  @HasMany(() => Cert)
  certs: Array<Cert>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
