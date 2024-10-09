import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Language } from '@interfaces/language.enum';

const languageTypes = [Language.PL, Language.EN, Language.RU];

interface PagesContentCreationAttributes {
  contentLanguage: Language;
  contents: Array<string>;
}

@Table({ tableName: 'pages_content' })
export class PagesContent extends Model<
  PagesContent,
  PagesContentCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.ENUM(...languageTypes),
    allowNull: false,
    field: 'content_language'
  })
  contentLanguage: Language;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  contents: Array<string>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
