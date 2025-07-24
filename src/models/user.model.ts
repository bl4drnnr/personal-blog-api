import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Session } from '@models/session.model';
import { ArticleModel } from '@models/article.model';
import { UserSettings } from '@models/user-settings.model';

interface UserCreationAttributes {
  email: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'first_name'
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'last_name'
  })
  lastName: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_mfa_set'
  })
  isMfaSet: boolean;

  @HasMany(() => ArticleModel)
  articles: Array<ArticleModel>;

  @HasOne(() => Session)
  session: Session;

  @HasOne(() => UserSettings)
  userSettings: UserSettings;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
