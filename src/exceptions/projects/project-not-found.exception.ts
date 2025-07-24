import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  readonly message: string;

  constructor(message = 'project-not-found') {
    super(message);
    this.message = message;
  }
}
