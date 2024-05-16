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
import { CategoryModel } from '@models/category.model';

interface ArticleCreationAttributes {
  articleName: string;
  articleSlug: string;
  articleDescription: string;
  articleTags: Array<string>;
  userId: string;
  categoryId: string;
}

@Table({ tableName: 'articles' })
export class ArticleModel extends Model<
  ArticleModel,
  ArticleCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'article_name' })
  articleName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
    field: 'article_slug'
  })
  articleSlug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'article_description'
  })
  articleDescription: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'article_tags'
  })
  articleTags: Array<string>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.UUID, allowNull: false, field: 'category_id' })
  categoryId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
