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

interface ExperiencePositionCreationAttributes {
  positionTitle: string;
  positionDescription: string;
  positionStartDate: Date;
  positionEndDate: Date;
  experienceId: string;
}

@Table({ tableName: 'experience_positions' })
export class ExperiencePosition extends Model<
  ExperiencePosition,
  ExperiencePositionCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'position_title' })
  positionTitle: string;

  @Column({
    type: DataType.STRING,
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

  @Column({ type: DataType.DATE, allowNull: false, field: 'position_end_date' })
  positionEndDate: Date;

  @ForeignKey(() => Experience)
  @Column({ type: DataType.UUID, allowNull: false, field: 'experience_id' })
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
