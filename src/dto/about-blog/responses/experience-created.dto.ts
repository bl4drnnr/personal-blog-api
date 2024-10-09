import { CreatedExperience } from '@interfaces/created-experience.interface';

export class ExperienceCreatedDto {
  readonly createdExperiences: Array<CreatedExperience>;
  readonly message: string;

  constructor(
    createdExperiences: Array<CreatedExperience>,
    message = 'experience-created'
  ) {
    this.createdExperiences = createdExperiences;
    this.message = message;
  }
}
