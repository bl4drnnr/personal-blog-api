import {
  Table,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Column
} from 'sequelize-typescript';

interface PostCreationAttributes {
  title: string;
  slug: string;
}

@Table
export class Post extends Model<Post, PostCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;
}
