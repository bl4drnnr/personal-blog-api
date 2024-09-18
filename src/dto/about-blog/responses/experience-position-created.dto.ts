export class ExperiencePositionCreatedDto {
  readonly message: string;

  constructor(message = 'experience-position-created') {
    this.message = message;
  }
}
