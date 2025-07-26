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
import { PrivacyPage } from './privacy-page.model';
import { PrivacyContentItem } from './privacy-content-item.model';

interface PrivacySectionCreationAttributes {
  privacyPageId?: string;
  title: string;
  sortOrder?: number;
  sectionType?: 'main' | 'cookie_policy';
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
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @Column({
    type: DataType.ENUM('main', 'cookie_policy'),
    allowNull: false,
    defaultValue: 'main',
    field: 'section_type'
  })
  sectionType: 'main' | 'cookie_policy';

  @BelongsTo(() => PrivacyPage)
  privacyPage: PrivacyPage;

  @HasMany(() => PrivacyContentItem)
  content: PrivacyContentItem[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
