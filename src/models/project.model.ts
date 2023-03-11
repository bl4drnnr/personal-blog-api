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
}
