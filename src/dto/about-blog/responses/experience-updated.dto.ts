export class ExperienceUpdatedDto {
  readonly message: string;

  constructor(message = 'experience-updated') {
    this.message = message;
  }
}
