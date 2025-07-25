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
import { Position } from '@models/position.model';

interface ExperienceCreationAttributes {
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  order?: number;
}

@Table({ tableName: 'experiences' })
export class Experience extends Model<Experience, ExperienceCreationAttributes> {
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
    allowNull: true,
    field: 'company_logo'
  })
  companyLogo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'company_website'
  })
  companyWebsite: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'order'
  })
  order: number;

  @HasMany(() => Position)
  positions: Position[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
