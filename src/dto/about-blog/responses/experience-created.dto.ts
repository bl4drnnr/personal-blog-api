export class ExperienceCreatedDto {
  readonly experiencesIds: Array<string>;
  readonly message: string;

  constructor(experiencesIds: Array<string>, message = 'experience-created') {
    this.experiencesIds = experiencesIds;
    this.message = message;
  }
}
