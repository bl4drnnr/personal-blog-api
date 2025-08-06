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

interface FaqCreationAttributes {
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  featured: boolean;
}

@Table({ tableName: 'faqs' })
export class Faq extends Model<Faq, FaqCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'question'
  })
  question: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'answer'
  })
  answer: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  })
  isActive: boolean;

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
