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
import { Language } from '@interfaces/language.enum';

const languageTypes = [Language.PL, Language.EN, Language.RU];

interface ArticleCreationAttributes {
  articleName: string;
  articleSlug: string;
  articleDescription: string;
  articleTags: Array<string>;
  articleContent: string;
  articleImage: string;
  articleLanguage: Language;
  userId: string;
  categoryId: string;
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
    field: 'article_name'
  })
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

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'article_content'
  })
  articleContent: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'article_image'
  })
  articleImage: string;

  @Column({
    type: DataType.ENUM(...languageTypes),
    allowNull: false,
    field: 'article_language'
  })
  articleLanguage: Language;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'article_posted'
  })
  articlePosted: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ForeignKey(() => CategoryModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'category_id'
  })
  categoryId: string;

  @BelongsTo(() => CategoryModel)
  category: CategoryModel;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
