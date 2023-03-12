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

interface ProjectCreationAttributes {
  title: string;
  slug: string;
}

export interface ITechStack {
  src: string;
  width: number;
  height: number;
}

export interface IProjectPage {
  link: string;
  text: string;
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

@Table({
  tableName: 'projects'
})
export class Project extends Model<Project, ProjectCreationAttributes> {
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
  brief: string;

  @Column({ type: DataType.STRING, allowNull: false })
  tags: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'search_tags'
  })
  searchTags: Array<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'brief_description'
  })
  briefDescription: string;

  @Column({ type: DataType.STRING, allowNull: false })
  license: string;

  @Column({ type: DataType.JSON, allowNull: false, field: 'tech_stack' })
  techStack: Array<ITechStack>;

  @Column({ type: DataType.JSON, allowNull: false, field: 'project_pages' })
  projectPages: Array<IProjectPage>;

  @Column({ type: DataType.JSON, allowNull: false })
  toc: object;

  @Column({ type: DataType.JSON, allowNull: false })
  content: Array<string | IPicture | IList | ICode | ITitle>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
