import {
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  UpdatedAt,
  BelongsTo,
  Table
} from 'sequelize-typescript';
import { EndUser } from '@models/end-user.model';
import { Language } from '@interfaces/language.enum';

const languageTypes = [Language.PL, Language.EN, Language.RU];

interface NewslettersCreationAttributes {
  endUserId: string;
  newslettersLanguage: Language;
}

@Table({ tableName: 'newsletters' })
export class Newsletter extends Model<
  Newsletter,
  NewslettersCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => EndUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'end_user_id'
  })
  endUserId: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_confirmed'
  })
  isConfirmed: boolean;

  @Column({
    type: DataType.ENUM(...languageTypes),
    allowNull: false,
    field: 'newsletters_language'
  })
  newslettersLanguage: Language;

  @BelongsTo(() => EndUser)
  endUser: EndUser;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
