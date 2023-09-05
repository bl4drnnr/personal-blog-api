import { BadRequestException } from '@nestjs/common';

export class WrongOrderOptionException extends BadRequestException {
  constructor() {
    super('wrong-order-option');
  }
}
