import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Newsletter } from '@models/newsletters.model';

interface EndUserCreationAttributes {
  email: string;
}

@Table({ tableName: 'end_users' })
export class EndUser extends Model<
  EndUser,
  EndUserCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @HasOne(() => Newsletter)
  newsletter: Newsletter;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
