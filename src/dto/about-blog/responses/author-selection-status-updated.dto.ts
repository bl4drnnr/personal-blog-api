export class AuthorSelectionStatusUpdatedDto {
  readonly message: string;
  readonly authorStatus: boolean;

  constructor(authorStatus: boolean, message: string = 'author-status-updated') {
    this.message = message;
    this.authorStatus = authorStatus;
  }
}
