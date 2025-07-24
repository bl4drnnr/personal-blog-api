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
import { User } from '@models/user.model';

interface ProjectCreationAttributes {
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage?: string;
  tags?: Array<string>;
  technologies?: Array<string>;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  published?: boolean;
  userId: string;
}

@Table({ tableName: 'projects' })
export class ProjectModel extends Model<ProjectModel, ProjectCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title'
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'slug'
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'content'
  })
  content: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'featured_image'
  })
  featuredImage: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'tags'
  })
  tags: Array<string>;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'technologies'
  })
  technologies: Array<string>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'github_url'
  })
  githubUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'demo_url'
  })
  demoUrl: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'featured'
  })
  featured: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'published'
  })
  published: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
