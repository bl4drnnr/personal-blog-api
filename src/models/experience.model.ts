import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { ExperiencePosition } from '@models/experience-position.model';
import { Author } from '@models/author.model';

interface ExperienceCreationAttributes {
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  companyPicture: string;
  obtainedSkills: Array<string>;
  startDate: Date;
  endDate?: Date;
  authorId: string;
}

@Table({ tableName: 'experiences' })
export class Experience extends Model<
  Experience,
  ExperienceCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_name'
  })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_description'
  })
  companyDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_link'
  })
  companyLink: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_link_title'
  })
  companyLinkTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_picture'
  })
  companyPicture: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'obtained_skills'
  })
  obtainedSkills: Array<string>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_date'
  })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'end_date' })
  endDate: Date;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_selected'
  })
  isSelected: boolean;

  @ForeignKey(() => Author)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'author_id'
  })
  authorId: string;

  @BelongsTo(() => Author)
  author: Author;

  @HasMany(() => ExperiencePosition)
  experiencePositions: Array<ExperiencePosition>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
