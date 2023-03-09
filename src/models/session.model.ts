import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

interface SessionCreationAttributes {
  tokenId: string;
  userId: string;
}

@Table
export class Session extends Model<Session, SessionCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  tokenId: string;

  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;
}
