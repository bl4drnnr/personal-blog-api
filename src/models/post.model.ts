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
import { User } from '@models/user.model';
import { Section } from '@interfaces/section.interface';

interface PostCreationAttributes {
  postName: string;
  postSlug: string;
  postDescription: string;
  postTags: Array<string>;
  sections: Array<any>;
  userId: string;
}

@Table({ tableName: 'posts' })
export class PostModel extends Model<PostModel, PostCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'post_name' })
  postName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
    field: 'post_slug'
  })
  postSlug: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: 'post_description' })
  postDescription: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'post_tags'
  })
  postTags: Array<string>;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  sections: Array<Section>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
