export class ExperiencePositionDeletedDto {
  readonly message: string;

  constructor(message = 'experience-position-deleted') {
    this.message = message;
  }
}
