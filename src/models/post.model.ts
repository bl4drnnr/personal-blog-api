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

interface PostCreationAttributes {
  language: LanguageType;
  title: string;
  slug: string;
  tags: string;
  type: Array<string>;
  description: string;
  pageDescription: string;
  searchTags: Array<string>;
  intro: string;
  toc: object;
  content: Array<string | IPicture | IList | ICode | ITitle>;
  references: Array<ILink>;
}

export interface ILink {
  name: string;
  link: string;
}

export interface IPicture {
  type: 'picture';
  width: string;
  resource: string;
}

export interface IList {
  type: 'list-numeric' | 'list-bullet';
  items: Array<any>;
  style: string;
}

export interface ICode {
  type: 'code';
  lang: string;
  content: string;
}

export interface ITitle {
  type: 'title' | 'subtitle' | 'subsubtitle';
  content: string;
}

export enum LanguageType {
  pl = 'pl',
  ru = 'ru',
  en = 'en'
}

export enum PostType {
  theory = 'theory',
  practice = 'practice'
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
    type: DataType.ENUM(...Object.values(LanguageType)),
    allowNull: false
  })
  language: LanguageType;

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
  content: Array<string | IPicture | IList | ICode | ITitle>;

  @Column({ type: DataType.JSON, allowNull: false, field: 'references' })
  references: Array<ILink>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
