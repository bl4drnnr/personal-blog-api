import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  UpdatedAt
} from 'sequelize-typescript';
import { Language } from '@interfaces/language.enum';

const languageTypes = [Language.PL, Language.EN, Language.RU];

interface PagesContentCreationAttributes {}

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

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
