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
import { IPicture } from '@interfaces/picture.interface';
import { IList } from '@interfaces/list.interface';
import { ICode } from '@interfaces/code.interface';
import { ITitle } from '@interfaces/title.interface';
import { Language } from '@enums/language.enum';
import { ITechStack } from '@interfaces/tech-stack.interface';
import { IProjectPage } from '@interfaces/project-page.interface';
import { IParagraph } from '@interfaces/paragraph.interface';

interface ProjectCreationAttributes {
  language: Language;
  title: string;
  slug: string;
  brief: string;
  tags: string;
  description: string;
  searchTags: Array<string>;
  briefDescription: string;
  license: string;
  techStack: Array<ITechStack>;
  projectPages: Array<IProjectPage>;
  projectTags: Array<string>;
  toc: object;
  content: Array<IParagraph | IPicture | IList | ICode | ITitle>;
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
    type: DataType.ENUM(...Object.values(Language)),
    allowNull: false
  })
  language: Language;

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

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'project_tags'
  })
  projectTags: Array<string>;

  @Column({ type: DataType.JSON, allowNull: false })
  toc: object;

  @Column({ type: DataType.JSON, allowNull: false })
  content: Array<IParagraph | IPicture | IList | ICode | ITitle>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
