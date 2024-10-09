export class ExperienceSelectionStatusUpdatedDto {
  readonly message: string;
  readonly experienceStatus: boolean;

  constructor(
    experienceStatus: boolean,
    message: string = 'experience-status-updated'
  ) {
    this.message = message;
    this.experienceStatus = experienceStatus;
  }
}
