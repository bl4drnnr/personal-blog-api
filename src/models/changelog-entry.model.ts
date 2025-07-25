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
import { ChangelogPage } from './changelog-page.model';

interface ChangelogEntryCreationAttributes {
  changelogPageId?: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
  sortOrder?: number;
}

@Table({ tableName: 'changelog_entries' })
export class ChangelogEntry extends Model<
  ChangelogEntry,
  ChangelogEntryCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ChangelogPage)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'changelog_page_id'
  })
  changelogPageId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'version'
  })
  version: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'date'
  })
  date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'changes'
  })
  changes: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  })
  sortOrder: number;

  @BelongsTo(() => ChangelogPage)
  changelogPage: ChangelogPage;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
