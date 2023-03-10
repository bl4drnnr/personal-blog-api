import {
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { Session } from '@models/session.model';
import { ConfirmationHash } from '@models/confirmation-hash.model';

interface UserCreationAttributes {
  email: string;
  password: string;
}

@Table
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  accountConfirm: boolean;

  @HasOne(() => Session)
  session: Session;

  @HasMany(() => ConfirmationHash)
  confirmationHash: ConfirmationHash[];
}
