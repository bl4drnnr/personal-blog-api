export class ExperiencePositionUpdatedDto {
  readonly message: string;

  constructor(message = 'experience-position-updated') {
    this.message = message;
  }
}
