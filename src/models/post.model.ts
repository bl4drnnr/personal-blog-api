import {
  Table,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Column,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { Language } from '@enums/language.enum';
import { IPicture } from '@interfaces/picture.interface';
import { IList } from '@interfaces/list.interface';
import { ICode } from '@interfaces/code.interface';
import { ITitle } from '@interfaces/title.interface';
import { ILink } from '@interfaces/link.interface';
import { PostType } from '@enums/post-type.enum';
import { IParagraph } from '@interfaces/paragraph.interface';

interface PostCreationAttributes {
  language: Language;
  title: string;
  slug: string;
  tags: string;
  type: Array<string>;
  description: string;
  pageDescription: string;
  searchTags: Array<string>;
  intro: string;
  toc: object;
  content: Array<IParagraph | IPicture | IList | ICode | ITitle>;
  references: Array<ILink>;
}

@Table({
  tableName: 'posts'
})
export class Post extends Model<Post, PostCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(Language)),
    allowNull: false
  })
  language: Language;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  tags: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  type: Array<PostType>;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: 'page_description' })
  pageDescription: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'search_tags'
  })
  searchTags: Array<string>;

  @Column({ type: DataType.TEXT, allowNull: false })
  intro: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  footer: string;

  @Column({ type: DataType.JSON, allowNull: false })
  toc: object;

  @Column({ type: DataType.JSON, allowNull: false })
  content: Array<IParagraph | IPicture | IList | ICode | ITitle>;

  @Column({ type: DataType.JSON, allowNull: false, field: 'references' })
  references: Array<ILink>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
