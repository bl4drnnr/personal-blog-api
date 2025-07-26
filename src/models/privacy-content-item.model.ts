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
import { PrivacySection } from './privacy-section.model';

interface PrivacyContentItemCreationAttributes {
  privacySectionId?: string;
  type: string;
  text?: string;
  items?: string[];
  linkText?: string;
  linkUrl?: string;
  sortOrder?: number;
}

@Table({ tableName: 'privacy_content_items' })
export class PrivacyContentItem extends Model<
  PrivacyContentItem,
  PrivacyContentItemCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => PrivacySection)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'privacy_section_id'
  })
  privacySectionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'type'
  })
  type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'text'
  })
  text: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'items'
  })
  items: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'link_text'
  })
  linkText: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'link_url'
  })
  linkUrl: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @BelongsTo(() => PrivacySection)
  privacySection: PrivacySection;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
