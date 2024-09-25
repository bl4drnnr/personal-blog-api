import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { ArticleModel } from '@models/article.model';
import { Language } from '@interfaces/language.enum';

interface CategoryCreationAttributes {
  categoryName: string;
  categoryDescription: string;
  categoryLanguage: Language;
}

const languageTypes = [Language.PL, Language.EN, Language.RU];

@Table({ tableName: 'categories' })
export class CategoryModel extends Model<CategoryModel, CategoryCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'category_name'
  })
  categoryName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'category_description'
  })
  categoryDescription: string;

  @Column({
    type: DataType.ENUM(...languageTypes),
    allowNull: false,
    field: 'category_language'
  })
  categoryLanguage: Language;

  @HasMany(() => ArticleModel)
  articles: Array<ArticleModel>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
