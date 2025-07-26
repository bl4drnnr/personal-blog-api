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

interface WhysSectionCreationAttributes {
  title: string;
  whyBlocks: object;
  features: object;
  featured?: boolean;
}

@Table({ tableName: 'whys_sections' })
export class WhysSection extends Model<WhysSection, WhysSectionCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'why_blocks'
  })
  whyBlocks: object;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'features'
  })
  features: object;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'featured'
  })
  featured: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
