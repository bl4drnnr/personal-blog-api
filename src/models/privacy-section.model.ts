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
import { PrivacyPage } from './privacy-page.model';

interface PrivacySectionCreationAttributes {
  privacyPageId?: string;
  title: string;
  content?: string;
  sortOrder?: number;
}

@Table({ tableName: 'privacy_sections' })
export class PrivacySection extends Model<
  PrivacySection,
  PrivacySectionCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => PrivacyPage)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'privacy_page_id'
  })
  privacyPageId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'content'
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @BelongsTo(() => PrivacyPage)
  privacyPage: PrivacyPage;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
