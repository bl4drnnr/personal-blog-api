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

export interface CopyrightLinkInterface {
  title: string;
  link: string;
}

interface CopyrightCreationAttributes {
  copyrightEmail: string;
  copyrightText: string;
  copyrightLinks: CopyrightLinkInterface[];
}

@Table({ tableName: 'copyright' })
export class Copyright extends Model<Copyright, CopyrightCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'copyright_email'
  })
  copyrightEmail: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'copyright_text'
  })
  copyrightText: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'copyright_links'
  })
  copyrightLinks: CopyrightLinkInterface[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
