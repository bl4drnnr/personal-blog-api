export class CategoryDeletedDto {
  readonly message: string;

  constructor(message = 'category-deleted') {
    this.message = message;
  }
}
