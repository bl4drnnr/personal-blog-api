export class CategoryCreatedDto {
  readonly message: string;

  constructor(message = 'category-created') {
    this.message = message;
  }
}
