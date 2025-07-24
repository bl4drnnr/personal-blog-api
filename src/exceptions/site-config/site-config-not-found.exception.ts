import { HttpException, HttpStatus } from '@nestjs/common';

export class SiteConfigNotFoundException extends HttpException {
  constructor() {
    super(
      'Site configuration not found. Please create site configuration first.',
      HttpStatus.NOT_FOUND
    );
  }
}
