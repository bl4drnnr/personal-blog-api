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

interface PositionCreationAttributes {
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills?: string[];
  experienceId: string;
  order?: number;
}

@Table({ tableName: 'positions' })
export class Position extends Model<Position, PositionCreationAttributes> {
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
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date'
  })
  startDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date'
  })
  endDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'skills'
  })
  skills: string[];

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order'
  })
  order: number;

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
