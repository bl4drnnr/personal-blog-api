import { NotFoundException } from '@nestjs/common';

export class ChangelogEntryNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Changelog entry not found') {
    super(message);
    this.message = message;
  }
}
