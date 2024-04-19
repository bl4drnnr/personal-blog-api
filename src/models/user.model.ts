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
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UserSettings } from './user-settings.model';
import { PostModel } from '@models/post.model';

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

  @Column({ type: DataType.STRING, allowNull: true, field: 'first_name' })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'last_name' })
  lastName: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_mfa_set'
  })
  isMfaSet: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'tac'
  })
  tac: boolean;

  @HasMany(() => ConfirmationHash)
  confirmationHashes: Array<ConfirmationHash>;

  @HasMany(() => PostModel)
  posts: Array<PostModel>;

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
