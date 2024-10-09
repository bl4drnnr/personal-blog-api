export class ExperienceDeletedDto {
  readonly message: string;

  constructor(message = 'experience-deleted') {
    this.message = message;
  }
}
