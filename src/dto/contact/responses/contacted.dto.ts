export class ContactedDto {
  private readonly message: string;

  constructor(message = 'contacted') {
    this.message = message;
  }
}
