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
import { Experience } from '@models/experience.model';
import { Language } from '@interfaces/language.enum';

const languageTypes = [Language.PL, Language.EN, Language.RU];

interface ExperiencePositionCreationAttributes {
  positionTitle: string;
  positionDescription: string;
  positionStartDate: Date;
  positionEndDate: Date;
  positionLanguage: Language;
  experienceId: string;
}
// @TODO Add maximum number of characters available for a field
// @TODO Add validation (both front and back) for the max amount as well

@Table({ tableName: 'experience_positions' })
export class ExperiencePosition extends Model<
  ExperiencePosition,
  ExperiencePositionCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'position_title'
  })
  positionTitle: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'position_description'
  })
  positionDescription: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'position_start_date'
  })
  positionStartDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'position_end_date'
  })
  positionEndDate: Date;

  @Column({
    type: DataType.ENUM(...languageTypes),
    allowNull: false,
    field: 'position_language'
  })
  positionLanguage: Language;

  @ForeignKey(() => Experience)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'experience_id'
  })
  experienceId: string;

  @BelongsTo(() => Experience)
  experience: Experience;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
