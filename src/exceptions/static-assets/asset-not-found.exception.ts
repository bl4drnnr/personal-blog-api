import { HttpException, HttpStatus } from '@nestjs/common';

export class AssetNotFoundException extends HttpException {
  constructor() {
    super('Static asset not found', HttpStatus.NOT_FOUND);
  }
}
