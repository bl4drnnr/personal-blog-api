export class CategoryEditedDto {
  readonly message: string;

  constructor(message = 'category-edited') {
    this.message = message;
  }
}
