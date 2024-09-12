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
import { User } from '@models/user.model';
import { ExperiencePosition } from '@models/experience-position.model';

// {
//   companyName: 'Cryptovoucher / P100',
//     companyDescription:
//   'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
//     companyLink: 'https://cryptovoucher.io',
//   companyLinkTitle: 'Cryptovoucher Official Website',
//   companyPicture: 'cv.jpeg',
//   startDate: new Date(),
//   endDate: new Date(),
//   companyPositions: [
//   {
//     positionTitle: 'Full-Stack Web Developer',
//     positionDescription:
//       'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloremque harum itaque magni natus obcaecati odio quae rem! Amet beatae dolorum enim et in magnam molestias natus possimus recusandae tempore.',
//     positionStartDate: new Date(),
//     positionEndDate: new Date()
//   }
// ]
// },

interface ExperienceCreationAttributes {
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  companyPicture: string;
  startDate: Date;
}

@Table({ tableName: 'experiences' })
export class Experience extends Model<
  Experience,
  ExperienceCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'company_name' })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_description'
  })
  companyDescription: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'company_link' })
  companyLink: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_link_title'
  })
  companyLinkTitle: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'company_picture' })
  companyPicture: string;

  @Column({ type: DataType.DATE, allowNull: false, field: 'start_date' })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false, field: 'end_date' })
  endDate: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ExperiencePosition)
  experiencePositions: Array<ExperiencePosition>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
