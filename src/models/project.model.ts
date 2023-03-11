import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table
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

@Table({
  tableName: 'projects'
})
export class Project extends Model<Project, ProjectCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  brief: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.JSON, allowNull: false })
  searchTags: Array<string>;

  @Column({ type: DataType.STRING, allowNull: false })
  briefDescription: string;

  @Column({ type: DataType.STRING, allowNull: false })
  license: string;

  @Column({ type: DataType.JSON, allowNull: false })
  techStack: Array<ITechStack>;

  @Column({ type: DataType.JSON, allowNull: false })
  projectPages: Array<IProjectPage>;

  @Column({ type: DataType.JSON, allowNull: false })
  toc: object;

  @Column({ type: DataType.JSON, allowNull: false })
  content: Array<string | IPicture | IList | ICode | ITitle>;
}
