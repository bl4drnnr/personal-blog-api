import { NotFoundException } from '@nestjs/common';

export class ChangelogPageContentNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'Changelog page content not found') {
    super(message);
    this.message = message;
  }
}
