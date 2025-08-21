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

interface ArticleCreationAttributes {
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt: string;
  featuredImageId: string;
  tags: Array<string>;
  metaKeywords: string;
  featured: boolean;
  published: boolean;
  userId: string;
}

@Table({ tableName: 'articles' })
export class ArticleModel extends Model<ArticleModel, ArticleCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'slug'
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'content'
  })
  content: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'excerpt'
  })
  excerpt: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'featured_image_id'
  })
  featuredImageId: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'tags'
  })
  tags: Array<string>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'meta_keywords'
  })
  metaKeywords: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'featured'
  })
  featured: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'published'
  })
  published: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true, field: 'user_id' })
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
